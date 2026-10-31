import { claimTask } from './queue';
import { performSearch } from './search';
import { db } from './db';
export async function runWorker({once=false}:{once?:boolean}={}){let stop=false;const halt=()=>{stop=true;};process.once('SIGINT',halt);process.once('SIGTERM',halt);try{while(!stop){const task=await claimTask();if(task)await performSearch(task);else if(once)break;else await new Promise(resolve=>setTimeout(resolve,350));}}finally{process.removeListener('SIGINT',halt);process.removeListener('SIGTERM',halt);await db().close();}}
