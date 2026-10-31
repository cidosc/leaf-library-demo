import Link from 'next/link';
export default function NotFound(){return <section className="empty-state"><h1>这一页还没有收录</h1><p>可以返回目录继续浏览。</p><Link href="/discover" className="button">返回目录</Link></section>;}
