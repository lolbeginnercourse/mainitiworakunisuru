"use client";

import {FormEvent,useState} from "react";

export default function ContactForm(){
  const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");const [error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setStatus("sending");setError("");const form=event.currentTarget;const data=Object.fromEntries(new FormData(form).entries());
    try{const response=await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});const result=await response.json() as {error?:string};if(!response.ok)throw new Error(result.error||"送信できませんでした。");setStatus("success");form.reset();}catch(e){setError(e instanceof Error?e.message:"送信できませんでした。");setStatus("error");}
  }
  return <form className="contact-form" onSubmit={submit}><div className="form-grid"><label>お名前<span>必須</span><input name="name" required autoComplete="name"/></label><label>メールアドレス<span>必須</span><input name="email" type="email" required autoComplete="email"/></label></div><label>お問い合わせ種別<span>必須</span><select name="category" required defaultValue=""><option value="" disabled>選択してください</option><option>掲載情報の修正</option><option>施設関係者からの連絡</option><option>広告・提携について</option><option>その他</option></select></label><label>件名<span>必須</span><input name="subject" required maxLength={120}/></label><label>お問い合わせ内容<span>必須</span><textarea name="message" required rows={8} maxLength={5000}/></label><label className="honeypot" aria-hidden="true">ウェブサイト<input name="website" tabIndex={-1} autoComplete="off"/></label><button className="primary-button" type="submit" disabled={status==="sending"}>{status==="sending"?"送信中…":"内容を送信する"}</button>{status==="success"&&<p className="form-success" role="status">お問い合わせを受け付けました。</p>}{status==="error"&&<p className="form-error" role="alert">{error}</p>}</form>
}
