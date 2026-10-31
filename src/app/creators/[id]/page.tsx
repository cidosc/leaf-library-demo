import Link from 'next/link';
import {notFound} from 'next/navigation';
import {creator,books} from '@/server/catalog';
import {WorkCard} from '@/components/content';
export const metadata={title:'示例作者'};
export default async function Creator({params}:{params:Promise<{id:string}>}){const author=await creator((await params).id);if(!author)notFound();const items=(await books()).filter(item=>item.creatorIds.includes(author.id));return <><Link href="/discover" className="back-link">← 返回目录</Link><div className="page-heading"><span className="eyebrow">SYNTHETIC CREATOR</span><h1>{author.name}</h1><p>{author.bio}</p></div><div className="work-grid">{items.map((book,index)=><WorkCard book={book} index={index} key={book.id}/>)}</div></>;}
