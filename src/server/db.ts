import { Pool, types, type PoolClient } from 'pg';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
types.setTypeParser(20,Number);
const state=globalThis as unknown as {leafDemoPool?:Pool;leafDemoContext?:AsyncLocalStorage<PoolClient>};
const context=state.leafDemoContext ||= new AsyncLocalStorage<PoolClient>();
export const id=(prefix:string)=>prefix+'-'+randomUUID();
function pool(){
 const url=new URL(process.env.DATABASE_URL||'postgresql://invalid');
 if(!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.pathname!='/leaf_demo')throw Error('Use the independent local leaf_demo database.');
 return state.leafDemoPool ||= new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:5000});
}
export async function query(sql:string,values:unknown[]=[]){let index=0;return (context.getStore()||pool()).query(sql.replace(/\?/g,()=>'$'+(++index)),values);}
export function transaction<T>(fn:()=>Promise<T>){
 const execute=async()=>{if(context.getStore())return fn();const client=await pool().connect();try{await client.query('BEGIN');const result=await context.run(client,fn);await client.query('COMMIT');return result;}catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}};
 execute.immediate=execute;return execute;
}
export function db(){return {transaction,prepare(sql:string){return {async all(...values:unknown[]){return (await query(sql,values)).rows;},async get(...values:unknown[]){return (await query(sql,values)).rows[0];},async run(...values:unknown[]){return {changes:(await query(sql,values)).rowCount||0};}};},async close(){if(state.leafDemoPool){await state.leafDemoPool.end();state.leafDemoPool=undefined;}}};}
