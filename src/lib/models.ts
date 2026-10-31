export interface CatalogCreator { id:string; name:string; aliases:string[]; bio:string; color:string; }
export interface CatalogBook { id:string; title:string; subtitle:string; aliases:string[]; creatorIds:string[]; tags:string[]; languages:string[]; cover:string; description:string; year:number; code:string; popularity:number; addedAt:string; sample:boolean; }
export interface CatalogSearch { id:string; ownerId:string; query:string; status:'pending'|'complete'|'failed'; bookIds:string[]; createdAt:string; finishedAt?:string; }
