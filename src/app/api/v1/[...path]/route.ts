import {NextRequest,NextResponse,after} from 'next/server';
import {z} from 'zod';
import {session,ensureSession} from '@/server/session';
import {book,books,savedBooks,saveBook} from '@/server/catalog';
import {createSearch,readSearch,executeSearch} from '@/server/search';
export const runtime='nodejs';
export const dynamic='force-dynamic';
type Context={params:Promise<{path:string[]}>};
const json=(value:unknown,status=200)=>NextResponse.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(_req:NextRequest,ctx:Context){try{const [resource,key,...extra]=(await ctx.params).path;if(extra.length)return json({error:'接口不存在'},404);if(resource==='books')return json(key?await book(key):{items:await books()});if(resource==='collections'&&!key)return json({items:await savedBooks(await session())});if(resource==='searches'&&key){const owner=await session();const job=owner?await readSearch(owner,key):undefined;if(!job)return json({error:'检索任务不存在'},404);const items=(await Promise.all(job.bookIds.map(book))).filter(Boolean);return json({...job,ownerId:undefined,items});}return json({error:'接口不存在'},404);}catch{return json({error:'暂时无法读取本地数据'},500);}}
export async function POST(req:NextRequest,ctx:Context){try{const origin=req.headers.get('origin');if(origin&&new URL(origin).host!==req.headers.get('host'))return json({error:'请求来源不匹配'},403);const [resource,key,...extra]=(await ctx.params).path;if(key||extra.length)return json({error:'接口不存在'},404);const body=await req.json();if(resource==='searches'){const input=z.object({query:z.string().trim().min(1).max(160)}).parse(body);const job=await createSearch(await ensureSession(),input.query);after(()=>executeSearch(job.id));return json({id:job.id},202);}if(resource==='collections'){const input=z.object({bookId:z.string().min(1).max(100),saved:z.boolean()}).parse(body);return json(await saveBook(await ensureSession(),input.bookId,input.saved));}return json({error:'接口不存在'},404);}catch(error){return json({error:error instanceof z.ZodError?'请检查输入内容':'暂时无法保存本地数据'},400);}}
