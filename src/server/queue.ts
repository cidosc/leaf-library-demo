import { randomUUID } from 'node:crypto';
import { db, id } from './db';
export interface Task {
  id: string;
  kind: string;
  resource_id: string;
  payload: string;
  status: string;
  attempts: number;
  available_at: number;
  lease_until: number | null;
  lease_token: string | null;
  last_error: string | null;
  created_at: number;
  updated_at: number;
}
export const QUEUE = { leaseMs: 60000, maxAttempts: 3, concurrency: 2 };
export async function enqueue(
  kind: string,
  resourceId: string,
  payload: unknown = {},
  availableAt = Date.now(),
) {
  const taskId = id('task'),
    now = Date.now();
  await db()
    .prepare(
      'INSERT INTO demo_tasks(id,kind,resource_id,payload,available_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(kind,resource_id) DO NOTHING',
    )
    .run(taskId, kind, resourceId, JSON.stringify(payload), availableAt, now, now);
  return (await db()
    .prepare('SELECT * FROM demo_tasks WHERE kind=? AND resource_id=?')
    .get(kind, resourceId)) as Task;
}
export async function claimTask(now = Date.now(), taskId?: string) {
  return await db()
    .transaction(async () => {
      // An abandoned final attempt is recorded as dead instead of remaining running forever.
      await db()
        .prepare(
          "UPDATE demo_tasks SET status='dead',lease_token=NULL,lease_until=NULL,last_error='Worker lease expired',updated_at=? WHERE status='running' AND lease_until<=? AND attempts>=?",
        )
        .run(now, now, QUEUE.maxAttempts);
      const task = (await db()
        .prepare(
          "SELECT * FROM demo_tasks WHERE ((status='queued' AND available_at<=?) OR (status='running' AND lease_until<=?)) AND attempts<?" +
            (taskId ? ' AND id=?' : '') +
            " ORDER BY available_at,created_at LIMIT 1 FOR UPDATE SKIP LOCKED",
        )
        .get(...[now, now, QUEUE.maxAttempts, ...(taskId ? [taskId] : [])])) as Task | undefined;
      if (!task) return;
      const token = randomUUID();
      await db()
        .prepare(
          "UPDATE demo_tasks SET status='running',attempts=attempts+1,lease_until=?,lease_token=?,updated_at=? WHERE id=?",
        )
        .run(now + QUEUE.leaseMs, token, now, task.id);
      return {
        ...task,
        status: 'running',
        attempts: task.attempts + 1,
        lease_until: now + QUEUE.leaseMs,
        lease_token: token,
        updated_at: now,
      };
    })
    .immediate();
}
export async function finishTask(task: Task, error?: unknown, now = Date.now()) {
  const state = error ? (task.attempts >= QUEUE.maxAttempts ? 'dead' : 'queued') : 'done';
  const message = error
    ? (error instanceof Error ? error.message : 'Task failed').slice(0, 500)
    : null;
  const delay = error ? Math.min(60000, 1000 * 2 ** task.attempts) : 0;
  return (
    (
      await db()
        .prepare(
          'UPDATE demo_tasks SET status=?,available_at=?,lease_until=NULL,lease_token=NULL,last_error=?,updated_at=? WHERE id=? AND lease_token=?',
        )
        .run(state, now + delay, message, now, task.id, task.lease_token)
    ).changes === 1
  );
}
export async function heartbeat(task: Task) {
  return (
    (
      await db()
        .prepare(
          "UPDATE demo_tasks SET lease_until=? WHERE id=? AND status='running' AND lease_token=?",
        )
        .run(Date.now() + QUEUE.leaseMs, task.id, task.lease_token)
    ).changes === 1
  );
}
export async function queueStats() {
  return await db()
    .prepare('SELECT status,count(*) count,min(created_at) oldest FROM demo_tasks GROUP BY status')
    .all();
}
