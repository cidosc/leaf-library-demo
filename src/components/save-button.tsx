'use client';
import {useState} from 'react';
import {Bookmark,Check} from 'lucide-react';
import {api} from '@/lib/api';
export function SaveButton({bookId,initialSaved=false}:{bookId:string;initialSaved?:boolean}){const [saved,setSaved]=useState(initialSaved);const [busy,setBusy]=useState(false);const [error,setError]=useState('');return <div><button className={'button '+(saved?'secondary':'')} aria-pressed={saved} disabled={busy} onClick={async()=>{setBusy(true);setError('');try{const result=await api<{saved:boolean}>('collections',{bookId,saved:!saved});setSaved(result.saved);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>{saved?<Check size={16}/>:<Bookmark size={16}/>} {saved?'已收藏':'加入收藏'}</button>{error&&<p className="error" role="alert">{error}</p>}</div>;}
