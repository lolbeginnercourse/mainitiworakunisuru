import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import SubShell from "../../components/SubShell";
import {areas,theaters} from "../../site-data";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const area=areas.find(a=>a.slug===slug);
  if(!area)return {};
  return {title:`${area.name}から通いやすい劇場とホテル｜ステージ泊`,description:`${area.name}を宿泊拠点にした場合の対応劇場、所要時間、移動方法、乗り換え回数を比較できます。`};
}

export default async function AreaPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const area=areas.find(a=>a.slug===slug);if(!area)notFound();
  const related=area.relations.map(relation=>({relation,theater:theaters.find(t=>t.slug===relation.theaterSlug)})).filter(item=>item.theater);
  return <SubShell><main><section className="subhero"><div className="site-container"><div className="breadcrumbs"><Link href="/">ホーム</Link> › <Link href="/areas">宿泊エリア</Link> › {area.name}</div><p className="eyebrow">STAY AREA GUIDE</p><h1>{area.name}から通いやすい劇場とホテル</h1><p>{area.description}</p></div></section><div className="site-container content-layout"><section><div className="content-card"><h2>{area.name}エリアの特徴</h2><p>公演当日の移動だけでなく、終演後と翌日の交通までまとめて考えたい人に向いています。イベント日は料金が変動しやすいため、日程が決まったら空室を確認してください。</p></div><div className="content-card"><h2>対応する劇場と移動目安</h2><div className="hotel-list">{related.map(({relation,theater})=><div className="hotel-row" key={relation.theaterSlug}><h3>{theater!.name}</h3><div className="info-grid"><div><small>所要時間</small><b>約{relation.minutes}分</b></div><div><small>移動方法</small><b>{relation.transport}</b></div><div><small>乗り換え</small><b>{relation.transfers}回</b></div><div><small>最寄り駅</small><b>{theater!.station}</b></div></div><Link className="outline-button" href={`/theaters/${theater!.slug}`}>劇場別ホテルを見る →</Link></div>)}</div></div></section><aside><div className="side-card"><b>エリア情報</b><p>宿泊拠点：{area.name}</p><p>対応劇場：{related.length}館</p><p>料金傾向：中〜高</p></div></aside></div></main></SubShell>
}
