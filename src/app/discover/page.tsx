import {Suspense} from 'react';
import Link from 'next/link';
import {SearchBox} from '@/components/search-box';
import {JobPanel} from '@/components/job-panel';
import {WorkCard,EmptyState} from '@/components/content';
import {books} from '@/server/catalog';
export const metadata={title:'发现图书'};
export default async function Discover({searchParams}:{searchParams:Promise<{job?:string;tag?:string;sort?:string}>}){const {job,tag,sort}=await searchParams;let items=await books();if(tag)items=items.filter(item=>item.tags.includes(tag));if(sort==='title')items.sort((a,b)=>a.title.localeCompare(b.title,'zh-CN'));return <><div className="page-heading"><span className="eyebrow">EXPLORE THE CATALOG</span><h1>发现图书</h1><p>一本书的标题、一个作者的名字，都可以成为起点。</p></div><SearchBox compact/>{job?<><Suspense fallback={<p>加载检索任务…</p>}><JobPanel jobId={job}/></Suspense><Link className="text-link reset-link" href="/discover">返回完整目录 ↗</Link></>:<><nav className="filter-tabs" aria-label="目录排序"><Link href="/discover" aria-current={!sort?'page':undefined}>精选目录</Link><Link href="/discover?sort=title" aria-current={sort==='title'?'page':undefined}>按标题</Link><span>{items.length} 本示例图书</span></nav>{tag&&<p className="tag-filter">标签：{tag} <Link href="/discover">清除筛选</Link></p>}{items.length?<div className="work-grid">{items.map((book,index)=><WorkCard book={book} index={index} key={book.id}/>)}</div>:<EmptyState title="这个标签还没有作品" description="可以返回完整目录查看其他图书。"/>}</>}</>;}
