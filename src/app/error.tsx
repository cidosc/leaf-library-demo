'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="empty-state"><h1>暂时没有打开这一页</h1><p>请确认本地数据库已经启动，再重试。</p><button className="button" onClick={reset}>重新加载</button></section>;}
