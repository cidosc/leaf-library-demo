export async function api<T>(path:string, body?:unknown):Promise<T>{
 const response=await fetch('/api/v1/'+path,{method:body===undefined?'GET':'POST',cache:'no-store',...(body===undefined?{}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})});
 const data=await response.json(); if(!response.ok)throw Error(data.error||'暂时无法完成，请重试'); return data;
}
