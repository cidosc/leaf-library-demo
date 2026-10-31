import type { CatalogBook, CatalogCreator } from '@/lib/models';
import { query } from './db';
export async function books(){return (await query('SELECT body FROM demo_books ORDER BY position')).rows.map(row=>row.body as CatalogBook);}
export async function book(id:string){return (await query('SELECT body FROM demo_books WHERE id=?',[id])).rows[0]?.body as CatalogBook|undefined;}
export async function creators(){return (await query('SELECT body FROM demo_creators ORDER BY id')).rows.map(row=>row.body as CatalogCreator);}
export async function creator(id:string){return (await query('SELECT body FROM demo_creators WHERE id=?',[id])).rows[0]?.body as CatalogCreator|undefined;}
export async function searchCatalog(value:string){
 const [items,authors]=await Promise.all([books(),creators()]);const terms=value.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
 return items.filter(item=>{const text=[item.title,item.subtitle,item.code,...item.aliases,...item.tags,...authors.filter(a=>item.creatorIds.includes(a.id)).flatMap(a=>[a.name,...a.aliases])].join(' ').normalize('NFKC').toLowerCase();return terms.every(term=>text.includes(term));});
}
export async function savedBooks(ownerId?:string){if(!ownerId)return [];return (await query('SELECT b.body FROM demo_collections c JOIN demo_books b ON b.id=c.book_id WHERE c.owner_id=? ORDER BY c.created_at DESC',[ownerId])).rows.map(row=>row.body as CatalogBook);}
export async function saved(ownerId:string|undefined,bookId:string){return !!ownerId&&!!(await query('SELECT 1 FROM demo_collections WHERE owner_id=? AND book_id=?',[ownerId,bookId])).rowCount;}
export async function saveBook(ownerId:string,bookId:string,active:boolean){if(!(await book(bookId)))throw Error('作品不存在');if(active)await query('INSERT INTO demo_collections(owner_id,book_id) VALUES(?,?) ON CONFLICT DO NOTHING',[ownerId,bookId]);else await query('DELETE FROM demo_collections WHERE owner_id=? AND book_id=?',[ownerId,bookId]);return {saved:active};}
