"use client";

import Link from "next/link";
import {useState} from "react";

export default function SiteHeader(){
  const [open,setOpen]=useState(false);
  return <header className="site-header">
    <div className="header-inner">
      <Link href="/" className="brand" aria-label="ステージ泊 ホーム"><span className="brand-mark">S</span><span>ステージ<span className="pink">泊</span><small>観劇遠征ホテルガイド</small></span></Link>
      <nav className="desktop-nav" aria-label="メインナビゲーション"><Link href="/theaters">劇場から探す</Link><Link href="/areas">エリア・ホテル</Link><Link href="/#purpose">目的から探す</Link></nav>
      <Link className="header-search" href="/#search">検索</Link>
      <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(v=>!v)}><span aria-hidden="true">{open?"×":"☰"}</span><span>メニュー</span></button>
    </div>
    <nav id="mobile-menu" className={`mobile-menu ${open?"is-open":""}`} aria-label="スマートフォン用メニュー">
      <Link href="/theaters" onClick={()=>setOpen(false)}>劇場から探す</Link><Link href="/areas" onClick={()=>setOpen(false)}>宿泊エリア・ホテルから探す</Link><Link href="/#purpose" onClick={()=>setOpen(false)}>目的から探す</Link><Link href="/about" onClick={()=>setOpen(false)}>このサイトについて</Link>
    </nav>
  </header>
}
