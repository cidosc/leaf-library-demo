import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { query } from './db';
const cookieName='leaf_demo_session';
export async function session(){const token=(await cookies()).get(cookieName)?.value;if(!token)return;return (await query('SELECT id FROM demo_sessions WHERE id=?',[token])).rows[0]?.id as string|undefined;}
export async function ensureSession(){const current=await session();if(current)return current;const token=randomBytes(32).toString('hex');await query('INSERT INTO demo_sessions(id) VALUES(?)',[token]);(await cookies()).set(cookieName,token,{httpOnly:true,sameSite:'lax',path:'/',maxAge:30*86400});return token;}
