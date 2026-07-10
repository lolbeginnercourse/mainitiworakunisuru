import {getDb} from "../../../db";
import {contactMessages} from "../../../db/schema";

export async function POST(request:Request){
  try{
    const body=await request.json() as Record<string,string>;
    if(body.website)return Response.json({ok:true},{status:201});
    const name=body.name?.trim();const email=body.email?.trim();const category=body.category?.trim();const subject=body.subject?.trim();const message=body.message?.trim();
    if(!name||!email||!category||!subject||!message)return Response.json({error:"必須項目を入力してください。"},{status:400});
    if(!/^\S+@\S+\.\S+$/.test(email))return Response.json({error:"メールアドレスを確認してください。"},{status:400});
    if(message.length>5000)return Response.json({error:"本文は5000文字以内で入力してください。"},{status:400});
    const db=await getDb();await db.insert(contactMessages).values({name,email,category,subject,message});
    return Response.json({ok:true},{status:201});
  }catch{return Response.json({error:"送信できませんでした。時間をおいて再度お試しください。"},{status:500});}
}
