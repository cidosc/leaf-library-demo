import Link from 'next/link';
import {session} from '@/server/session';
export const metadata={title:'本地访客会话'};
export default async function Account(){const active=!!(await session());return <article className="prose-page"><span className="eyebrow">LOCAL SESSION ONLY</span><h1>一个轻量的本地书架</h1><p>当前状态：{active?'已有本地访客会话':'浏览模式，首次检索或收藏时创建访客会话'}。</p><p>本演示不需要注册、邮箱或密码。为了把收藏与当前浏览器关联，会使用本站自己生成的 HttpOnly Cookie；该会话仅适用于本演示。</p><p>没有外部 Cookie 导入、账号绑定或其他网站的会话接入。</p><Link href="/collections" className="button">打开我的收藏 ↗</Link></article>;}
