import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import SubShell from "../../components/SubShell";
import {areas,hotelOptions,theaters} from "../../site-data";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const theater=theaters.find(t=>t.slug===slug);if(!theater)return {};
  return {title:`${theater.name}周辺のホテル候補｜観劇遠征向け`,description:`${theater.name}への観劇遠征で使いやすい宿泊エリアとホテル候補を、所要時間、乗り換え、荷物預かり、料金帯で比較できます。`};
}

export default async function TheaterPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const t=theaters.find(x=>x.slug===slug);if(!t)notFound();
  const mapQuery=encodeURIComponent(`${t.name} ${t.prefecture}`);
  const relatedAreas=areas.filter(area=>area.relations.some(relation=>relation.theaterSlug===t.slug));
  const alternatives=areas.filter(area=>!relatedAreas.some(current=>current.slug===area.slug)).slice(0,2);
  return <SubShell><main><section className="subhero"><div className="site-container"><div className="breadcrumbs"><Link href="/">ホーム</Link> › <Link href="/theaters">劇場一覧</Link> › {t.name}</div><p className="eyebrow">THEATER HOTEL GUIDE</p><h1>{t.name}周辺のホテル候補</h1>{t.verifiedAt&&<p>劇場・交通情報の確認日：{t.verifiedAt}</p>}</div></section><div className="site-container content-layout"><section>
    <div id="conclusion" className="content-card"><span className="tag">このページの結論</span><h2>{t.area}を基点に、終演後の戻りやすさで選ぶ</h2><p>{t.name}への近さを優先するなら徒歩圏、翌日の移動まで考えるなら駅周辺が候補です。料金だけでなく、乗り換え回数と駅からホテルまでの徒歩も比較してください。</p></div>
    <div id="theater-info" className="content-card"><h2>劇場基本情報</h2><div className="info-grid"><div><small>最寄り駅</small><b>{t.station}</b></div><div><small>おすすめエリア</small><b>{t.area}</b></div><div><small>ホテル候補</small><b>{hotelOptions.length}件</b></div><div><small>所在地</small><b>{t.prefecture}</b></div></div><p className="muted">キャリーケース利用時は、駅のエレベーター位置と推奨出口を事前に確認してください。</p></div>
    <div id="map" className="content-card"><h2>劇場と周辺の位置</h2><div className="map-frame"><iframe title={`${t.name}周辺地図`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}/></div><a className="outline-button" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">Googleマップで位置を確認（外部サイト） →</a></div>
    <div id="comparison" className="content-card"><h2>ホテル候補の比較表</h2><p className="muted">表は横にスクロールできます。</p><div className="table-wrap"><table className="compare-table"><thead><tr><th>ホテル候補</th><th>劇場まで</th><th>移動</th><th>乗換</th><th>料金帯</th><th>おすすめ対象</th></tr></thead><tbody>{hotelOptions.map(h=><tr key={h.slug}><td><b>{h.name}</b></td><td><b>{h.minutes}</b></td><td>{h.route}</td><td>{h.transfer}</td><td>{h.price}</td><td>{h.role}</td></tr>)}</tbody></table></div></div>
    <div id="hotels" className="content-card"><h2>ホテル候補の詳細</h2><div className="hotel-list">{hotelOptions.map(h=><article className="hotel-row" key={h.slug}><img className="hotel-image" src={h.image} alt={`${h.role}のホテル客室イメージ`}/><div className="hotel-row-head"><div><span className="tag">{h.role}</span><h3>{h.name}</h3><p>{h.note}</p></div><div className="minutes">{h.minutes}</div></div><div className="info-grid"><div><small>移動・乗換</small><b>{h.route} / {h.transfer}</b></div><div><small>駅から</small><b>{h.station}</b></div><div><small>荷物預かり</small><b>{h.luggage}</b></div><div><small>IN / OUT</small><b>{h.check}</b></div></div><p className="muted">参考料金帯：{h.price} ※宿泊日・人数・プランにより変動します。</p></article>)}</div></div>
    <div id="alternatives" className="content-card alternative-box"><h2>満室時の代替エリア</h2><p>同じ路線の隣駅、または新幹線・空港へ移動しやすい駅周辺まで範囲を広げます。乗り換えが増えない候補を優先してください。</p><div className="alternative-grid">{alternatives.map(area=><Link href={`/areas/${area.slug}`} key={area.slug}><b>{area.name}</b><span>{area.description}</span><i>エリア詳細を見る →</i></Link>)}</div></div>
  </section><aside><div className="side-card"><b>このページの内容</b><a href="#conclusion">結論</a><a href="#theater-info">劇場基本情報</a><a href="#map">地図</a><a href="#comparison">ホテル比較</a><a href="#hotels">ホテル候補の詳細</a><a href="#alternatives">満室時の代替案</a></div>{relatedAreas.length>0&&<div className="side-card"><b>対応する宿泊エリア</b>{relatedAreas.map(area=><Link href={`/areas/${area.slug}`} key={area.slug}>{area.name} →</Link>)}</div>}</aside></div></main></SubShell>
}
