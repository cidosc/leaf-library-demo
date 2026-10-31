CREATE TABLE IF NOT EXISTS demo_creators(id text PRIMARY KEY,body jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS demo_books(id text PRIMARY KEY,body jsonb NOT NULL,position integer NOT NULL);
CREATE TABLE IF NOT EXISTS demo_sessions(id text PRIMARY KEY,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS demo_collections(owner_id text NOT NULL REFERENCES demo_sessions(id),book_id text NOT NULL REFERENCES demo_books(id),created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(owner_id,book_id));
CREATE TABLE IF NOT EXISTS demo_searches(id text PRIMARY KEY,owner_id text NOT NULL REFERENCES demo_sessions(id),body jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS demo_tasks(id text PRIMARY KEY,kind text NOT NULL,resource_id text NOT NULL,payload text NOT NULL DEFAULT '{}',status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','running','done','dead')),attempts integer NOT NULL DEFAULT 0,available_at bigint NOT NULL,lease_until bigint,lease_token text,last_error text,created_at bigint NOT NULL,updated_at bigint NOT NULL,UNIQUE(kind,resource_id));
