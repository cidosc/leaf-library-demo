import {readFile} from 'node:fs/promises';
import {query,db} from '../src/server/db';
await query(await readFile(new URL('../src/server/schema.sql',import.meta.url),'utf8'));await db().close();console.log('Pure local demo schema ready');
