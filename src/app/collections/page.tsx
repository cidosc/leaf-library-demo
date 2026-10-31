import {savedBooks} from '@/server/catalog';
import {session} from '@/server/session';
import {WorkCard,EmptyState} from '@/components/content';
export const metadata={title:'我的收藏'};
export default async function Collections(){const items=await savedBooks(await session());return <><div className="page-heading"><span className="eyebrow">YOUR LOCAL SHELF</span><h1>我的收藏</h1><p>收藏只与当前浏览器的本地访客会话关联。</p></div>{items.length?<div className="work-grid">{items.map((book,index)=><WorkCard book={book} index={index} key={book.id}/>)}</div>:<EmptyState title="书架还空着" description="打开一部作品，点击“加入收藏”，再回来看看。"/>}<p className="page-note">清除 Cookie 会失去当前访客身份。本演示不连接外部账号，也不导入其他网站的会话。</p></>;}
