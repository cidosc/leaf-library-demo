import type { CatalogSearch } from '@/lib/models';
import { query,transaction,id } from './db';
import { enqueue,claimTask,finishTask, type Task } from './queue';
import { searchCatalog } from './catalog';
export async function createSearch(ownerId:string,value:string){return transaction(async()=>{const job:CatalogSearch={id:id('search'),ownerId,query:value,status:'pending',bookIds:[],createdAt:new Date().toISOString()};await query('INSERT INTO demo_searches(id,owner_id,body) VALUES(?,?,?::jsonb)',[job.id,ownerId,JSON.stringify(job)]);await enqueue('catalog-search',job.id);return job;})();}
export async function readSearch(ownerId:string,searchId:string){return (await query('SELECT body FROM demo_searches WHERE id=? AND owner_id=?',[searchId,ownerId])).rows[0]?.body as CatalogSearch|undefined;}
export async function performSearch(task:Task){try{const row=(await query('SELECT body FROM demo_searches WHERE id=?',[task.resource_id])).rows[0];if(row){const job=row.body as CatalogSearch;const results=await searchCatalog(job.query);await query('UPDATE demo_searches SET body=?::jsonb WHERE id=?',[JSON.stringify({...job,status:'complete',bookIds:results.map(item=>item.id),finishedAt:new Date().toISOString()}),job.id]);}await finishTask(task);}catch(error){await finishTask(task,error);}}
export async function executeSearch(searchId:string){const task=await enqueue('catalog-search',searchId);const claimed=await claimTask(Date.now(),task.id);if(claimed)await performSearch(claimed);}
