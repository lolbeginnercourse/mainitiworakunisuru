"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {useRouter} from "next/navigation";
import { areas, hotelOptions, purposes, regions, theaters } from "./site-data";
import SiteHeader from "./components/SiteHeader";

export default function Home() {
  const router=useRouter();
  const [query, setQuery] = useState("");
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const theaterResults=theaters.filter((t) => [t.name, t.area, t.station, ...t.aliases].join(" ").toLowerCase().includes(q)).map(t=>({type:"劇場",name:t.name,meta:`${t.prefecture}・${t.station}`,href:`/theaters/${t.slug}`}));
    const areaResults=areas.filter(a=>[a.name,a.description,a.station].join(" ").toLowerCase().includes(q)).map(a=>({type:"宿泊エリア",name:a.name,meta:a.description,href:`/areas/${a.slug}`}));
    const hotelResults=hotelOptions.filter(h=>[h.name,h.role,...h.purposes].join(" ").toLowerCase().includes(q)).map(h=>({type:"ホテル候補",name:h.name,meta:h.role,href:`/search?q=${encodeURIComponent(h.name)}`}));
    return [...theaterResults,...areaResults,...hotelResults].slice(0,6);
  }, [query]);

  return (
    <>
      <SiteHeader/>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">2.5次元ミュージカル・舞台 遠征ホテルガイド</p>
              <h1>観劇する劇場から、<br/><span>泊まりやすいホテル</span>を探す。</h1>
              <p className="lead">2.5次元ミュージカル・舞台の遠征向けに、劇場までの移動、終演後の戻りやすさ、荷物預かり、料金帯を比較できます。</p>
            </div>
            <section id="search" className="search-wrap" aria-label="サイト内検索">
              <p className="search-label">劇場・宿泊エリア・ホテルをまとめて検索</p>
              <form className="search-box" onSubmit={(e) => {e.preventDefault();router.push(`/search?q=${encodeURIComponent(query.trim())}`)}}>
                <span aria-hidden="true">⌕</span><label className="sr-only" htmlFor="site-search">劇場名・エリア・ホテル名で検索</label>
                <input id="site-search" name="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="劇場名・エリア・ホテル名で検索" autoComplete="off"/>
                <button className="search-button" type="submit">検索する</button>
              </form>
              {suggestions.length > 0 && <div className="suggestions">{suggestions.map(item => <Link key={`${item.type}-${item.name}`} href={item.href}><span>{item.type}</span><b>{item.name}</b><small>{item.meta}</small></Link>)}</div>}
              <p className="search-hint">例：銀河劇場、池袋、品川、梅田、ホテル名</p>
            </section>
          </div>
        </section>

        <section className="site-container section-block">
          <div className="entry-grid">
            <Link href="/theaters" className="entry-card entry-primary"><span className="entry-no">01</span><span className="entry-icon">劇</span><h2>劇場から探す</h2><p>観劇する劇場を起点に、泊まりやすいエリアと厳選ホテルを確認</p><b>劇場一覧を見る <span>→</span></b></Link>
            <Link href="/areas" className="entry-card entry-soft"><span className="entry-no">02</span><span className="entry-icon">宿</span><h2>宿泊エリア・ホテルから探す</h2><p>東京駅、品川、新宿、梅田など、移動拠点から関連劇場を逆引き</p><b>エリア一覧を見る <span>→</span></b></Link>
            <a href="#purpose" className="entry-card"><span className="entry-no">03</span><span className="entry-icon">選</span><h2>目的から探す</h2><p>近さ、料金、女性一人、荷物預かりなど、重視する条件で比較</p><b>条件を選ぶ <span>↓</span></b></a>
          </div>
        </section>

        <section className="site-container section-block">
          <div className="section-heading"><div><p className="eyebrow">THEATERS</p><h2>劇場から探す</h2></div><Link href="/theaters">劇場一覧を見る →</Link></div>
          <div className="theater-grid">{theaters.slice(0,6).map(t => <article className="theater-card" key={t.slug}><div className="card-top"><span>{t.area}</span><span>{t.prefecture}</span></div><h3>{t.name}</h3><dl><div><dt>最寄り</dt><dd>{t.station}</dd></div><div><dt>掲載</dt><dd>{hotelOptions.length}候補</dd></div></dl><p>{t.summary}</p><Link className="outline-button" href={`/theaters/${t.slug}`}>ホテルを見る <span>→</span></Link></article>)}</div>
        </section>

        <section className="soft-section"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">SEARCH BY AREA</p><h2>地域から探す</h2></div></div><div className="region-list">{regions.map(region=>{const count=theaters.filter(t=>region.prefectures.includes(t.prefecture)).length;return <Link href={`/theaters?region=${region.slug}`} key={region.slug}><span>{count}劇場</span>{region.name}<b>→</b></Link>})}</div></div></section>

        <section className="site-container section-block area-layout">
          <div><p className="eyebrow">POPULAR AREAS</p><h2>よく選ばれる宿泊エリア</h2><p className="muted">終演後の戻りやすさと、翌日の移動まで考えて選べます。</p></div>
          <div className="area-cards">{areas.map(a=><Link href={`/areas/${a.slug}`} key={a.slug}><span>{a.station}</span><h3>{a.name}</h3><p>{a.description}</p><small>対応劇場 {a.relations.length}館　→</small></Link>)}</div>
        </section>

        <section id="purpose" className="purpose-section"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">CHOOSE YOUR PRIORITY</p><h2>遠征で重視したいことから探す</h2></div></div><div className="purpose-grid">{purposes.map((p,i)=><Link href={`/search?purpose=${encodeURIComponent(p)}`} key={p}><span>{String(i+1).padStart(2,"0")}</span><b>{p}</b><i>→</i></Link>)}</div></div></section>

        <section className="site-container section-block guide-block"><div><p className="eyebrow">FIRST TRIP GUIDE</p><h2>初めての観劇遠征でも、<br/>選ぶ順番はシンプルです。</h2></div><ol><li><span>1</span><div><b>観劇する劇場を探す</b><p>劇場名や最寄り駅から検索</p></div></li><li><span>2</span><div><b>宿泊エリアの結論を確認</b><p>近さと帰りやすさを比較</p></div></li><li><span>3</span><div><b>条件の合うホテルを予約</b><p>荷物・料金・移動方法まで確認</p></div></li></ol></section>

        <section className="trust-section"><div className="site-container trust-inner"><div><span className="trust-mark">✓</span><div><h2>確認できる情報を、確認日とともに。</h2><p>劇場・ホテル・交通機関の公式情報と経路情報を基準に、定期的に見直します。</p></div></div><Link href="/policy">情報の確認基準 →</Link></div></section>
      </main>

      <footer><div className="site-container footer-grid"><div><Link href="/" className="brand brand-footer"><span className="brand-mark">S</span><span>ステージ<span className="pink">泊</span><small>観劇遠征ホテルガイド</small></span></Link><p>2.5次元ミュージカル・舞台の観劇遠征者が、劇場を起点にホテルを選ぶための非公式専門メディアです。</p></div><div><b>探す</b><Link href="/theaters">劇場から探す</Link><Link href="/areas">宿泊エリアから探す</Link><a href="#purpose">目的から探す</a></div><div><b>サイトについて</b><Link href="/about">このサイトについて</Link><Link href="/policy">編集方針・確認基準</Link><Link href="/contact">お問い合わせ</Link></div><div><b>運営・法務</b><Link href="/legal">運営者情報</Link><Link href="/legal#privacy">プライバシーポリシー</Link><Link href="/legal#disclaimer">免責事項</Link></div></div><div className="footer-bottom site-container"><span>※当サイトは各作品・劇場・ホテルの公式サイトではありません。</span><span>© 2026 ステージ泊</span></div></footer>
    </>
  );
}
