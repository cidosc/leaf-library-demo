'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BookOpen,Compass,Layers,Bookmark} from 'lucide-react';
const entries=[{href:'/',label:'首页',icon:BookOpen},{href:'/discover',label:'发现',icon:Compass},{href:'/architecture',label:'架构',icon:Layers}];
export function Navigation(){const path=usePathname();return <><header className="site-header"><div className="header-inner"><Link href="/" className="brand"><img src="/branding/leaf.svg" alt="" width={36} height={43}/><span>叶间书库</span><small>DEMO</small></Link><nav className="desktop-nav" aria-label="主导航">{entries.map(item=><Link href={item.href} key={item.href} aria-current={path===item.href?'page':undefined}>{item.label}</Link>)}</nav><Link href="/collections" className="collection-link"><Bookmark size={17}/><span>我的收藏</span></Link></div></header><nav className="mobile-nav" aria-label="手机导航">{entries.map(({href,label,icon:Icon})=><Link href={href} key={href} aria-current={path===href?'page':undefined}><Icon size={19}/>{label}</Link>)}<Link href="/collections"><Bookmark size={19}/>收藏</Link></nav></>;}
