import type {Metadata} from "next";
import Link from "next/link";
import SubShell from "../components/SubShell";
import {areas,hotelOptions,theaters} from "../site-data";

export const metadata:Metadata={title:"サイト内検索｜ステージ泊",description:"劇場名、宿泊エリア、ホテル候補、目的から観劇遠征の宿泊先を探せます。"};

export default async function Search({searchParams}:{searchParams:Promise<{q?:string;purpose?:string}>}){
  const p=await searchParams;const q=(p.q||"").trim().toLowerCase();const purpose=p.purpose||"";
  const theaterResults=q?theaters.filter(t=>[t.name,t.area,t.station,...t.aliases].join(" ").toLowerCase().includes(q)):purpose?[]:theaters;
  const areaResults=q?areas.filter(a=>[a.name,a.station,a.description].join(" ").toLowerCase().includes(q)):purpose?[]:areas;
  const hotelResults=hotelOptions.filter(h=>purpose?h.purposes.includes(purpose):q?[h.name,h.role,h.note,...h.purposes].join(" ").toLowerCase().includes(q):true);
  const label=purpose||p.q||"すべて";
  return <SubShell><main><section className="subhero"><div className="site-container"><div className="breadcrumbs"><Link href="/">ホーム</Link> › 検索結果</div><h1>「{label}」の検索結果</h1><p>劇場・宿泊エリア・ホテル候補を種類ごとに表示します。</p></div></section><div className="site-container content-layout"><section>{theaterResults.length>0&&<div className="content-card"><h2>劇場 <small>（{theaterResults.length}件）</small></h2>{theaterResults.map(t=><div className="hotel-row" key={t.slug}><span className="tag">劇場</span><h3>{t.name}</h3><p>{t.prefecture}・{t.area}｜最寄り {t.station}</p><Link className="outline-button" href={`/theaters/${t.slug}`}>詳細を見る →</Link></div>)}</div>}{areaResults.length>0&&<div className="content-card"><h2>宿泊エリア <small>（{areaResults.length}件）</small></h2>{areaResults.map(a=><div className="hotel-row" key={a.slug}><span className="tag">宿泊エリア</span><h3>{a.name}</h3><p>{a.description}</p><Link className="outline-button" href={`/areas/${a.slug}`}>エリア詳細を見る →</Link></div>)}</div>}{hotelResults.length>0&&<div className="content-card"><h2>ホテル候補 <small>（{hotelResults.length}件）</small></h2>{hotelResults.map(h=><div className="hotel-row" key={h.slug}><span className="tag">{h.role}</span><h3>{h.name}</h3><p>{h.note}</p><p className="muted">参考料金帯：{h.price}</p><Link className="outline-button" href="/theaters">利用する劇場を選ぶ →</Link></div>)}</div>}{theaterResults.length===0&&areaResults.length===0&&hotelResults.length===0&&<div className="content-card empty-state"><h2>該当する情報が見つかりませんでした</h2><p>劇場の略称、駅名、地域名など、短い言葉でもう一度検索してください。</p><Link className="primary-button" href="/theaters">劇場一覧を見る</Link></div>}</section><aside><div className="side-card"><b>検索のヒント</b><p>「銀河劇場」「天王洲」「池袋」のように、劇場の略称や駅名でも探せます。</p></div></aside></div></main></SubShell>
}
