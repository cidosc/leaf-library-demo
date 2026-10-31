'use client';
import {useEffect,useState} from 'react';
import type {CatalogSearch,CatalogBook} from '@/lib/models';
import {api} from '@/lib/api';
import {WorkCard,EmptyState} from './content';
type Result=Omit<CatalogSearch,'ownerId'>&{items:CatalogBook[]};
export function JobPanel({jobId}:{jobId:string}){const [result,setResult]=useState<Result>();const [error,setError]=useState('');useEffect(()=>{let active=true;let timer:ReturnType<typeof setTimeout>;async function poll(){try{const value=await api<Result>('searches/'+jobId);if(!active)return;setResult(value);if(value.status==='pending')timer=setTimeout(poll,600);}catch(error){if(active)setError((error as Error).message);}}void poll();return()=>{active=false;clearTimeout(timer);};},[jobId]);if(error)return <p className="error" role="alert">{error}</p>;if(!result||result.status==='pending')return <div className="empty-state" role="status"><h2>本地目录检索中</h2><p>请求已进入 PostgreSQL 任务队列，等待后台处理。</p></div>;return <section><div className="result-heading"><span className="eyebrow">LOCAL CATALOG</span><h2>“{result.query}”</h2><p>{result.items.length} 部示例作品 · 仅本地匹配，未调用识图或 AI 服务</p></div>{result.items.length?<div className="work-grid">{result.items.map((book,index)=><WorkCard book={book} index={index} key={book.id}/>)}</div>:<EmptyState title="没有找到匹配" description="试试标题、作者、标签或编号，例如“夏日”“花园”或“10001”。"/>}</section>;}
