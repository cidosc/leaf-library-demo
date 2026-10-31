import type {Metadata,Viewport} from 'next';
import Link from 'next/link';
import {Navigation} from '@/components/navigation';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://127.0.0.1:3100'),applicationName:'叶间书库',title:{default:'叶间书库 · 本地检索与收藏',template:'%s · 叶间书库'},description:'图书目录、后台检索任务与本地收藏的纯演示应用，使用合成数据和自制封面。',robots:{index:false,follow:false},icons:{icon:'/branding/favicon-32.png'}};
export const viewport:Viewport={colorScheme:'light dark',themeColor:[{media:'(prefers-color-scheme: light)',color:'#f4f8f6'},{media:'(prefers-color-scheme: dark)',color:'#101f24'}]};
export const dynamic='force-dynamic';
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body><div className="demo-notice">纯本地演示 · 所有图书、作者和目录数据均为合成示例</div><a className="skip-link" href="#main">跳到正文</a><Navigation/><main className="page-shell" id="main">{children}</main><footer className="site-footer"><div><strong>叶间书库 / Leaf Library</strong><p>检索、收藏，以及背后的实现。</p></div><nav aria-label="页脚导航"><Link href="/architecture">架构说明</Link><Link href="/help">使用说明</Link><Link href="/account">本地会话</Link></nav><p>自制封面 · 无外部服务接入</p></footer></body></html>;}
