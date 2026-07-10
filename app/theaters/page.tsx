import Link from "next/link";
import type {Metadata} from "next";
import SubShell from "../components/SubShell";
import {regions,theaters} from "../site-data";

export const metadata:Metadata={title:"劇場一覧｜ステージ泊",description:"2.5次元ミュージカル・舞台の観劇遠征で利用される劇場を、地域・都道府県から探せます。"};

export default async function Theaters({searchParams}:{searchParams:Promise<{region?:string;prefecture?:string}>}){
  const params=await searchParams;
  const activeRegion=regions.find(region=>region.slug===params.region);
  const visibleTheaters=theaters.filter(theater=>{
    if(params.prefecture) return theater.prefecture===params.prefecture;
    if(activeRegion) return activeRegion.prefectures.includes(theater.prefecture);
    return true;
  });
  const prefectures=[...new Set(theaters.map(theater=>theater.prefecture))].sort((a,b)=>a.localeCompare(b,"ja"));
  const title=params.prefecture?`${params.prefecture}の劇場`:activeRegion?`${activeRegion.name}の劇場`:"掲載劇場一覧";
  return <SubShell><main><section className="subhero"><div className="site-container"><div className="breadcrumbs"><Link href="/">ホーム</Link> › 劇場一覧{activeRegion?` › ${activeRegion.name}`:""}</div><p className="eyebrow">THEATER DIRECTORY</p><h1>{title}からホテルを探す</h1><p>{visibleTheaters.length}劇場を掲載しています。劇場を選ぶと、泊まりやすいエリアとホテルを確認できます。</p></div></section><div className="site-container content-layout"><section><div className="region-filter" aria-label="地域で絞り込む"><Link className={!activeRegion&&!params.prefecture?"is-active":""} href="/theaters">すべて</Link>{regions.map(region=><Link className={activeRegion?.slug===region.slug?"is-active":""} href={`/theaters?region=${region.slug}`} key={region.slug}>{region.name}</Link>)}</div><div className="content-card"><div className="list-heading"><h2>{title}</h2><span>{visibleTheaters.length}件</span></div>{visibleTheaters.length?<div className="theater-grid">{visibleTheaters.map(t=><article className="theater-card" key={t.slug}><div className="card-top"><span className="tag">{regions.find(r=>r.prefectures.includes(t.prefecture))?.name}</span><span>{t.prefecture}</span></div><h3>{t.name}</h3><dl><div><dt>最寄り</dt><dd>{t.station}</dd></div></dl><p>{t.summary}</p><Link className="outline-button" href={`/theaters/${t.slug}`}>ホテルを見る <span>→</span></Link></article>)}</div>:<div className="empty-state"><h2>該当する劇場はありません</h2><p>別の地域を選ぶか、掲載劇場一覧へ戻ってください。</p><Link className="primary-button" href="/theaters">すべての劇場を見る</Link></div>}</div></section><aside><div className="side-card"><b>都道府県から探す</b>{prefectures.map(prefecture=>{const count=theaters.filter(t=>t.prefecture===prefecture).length;return <Link href={`/theaters?prefecture=${encodeURIComponent(prefecture)}`} key={prefecture}>{prefecture}（{count}）</Link>})}</div><div className="side-card"><b>表示について</b><p className="muted">劇場の所在地を基準に地域分けしています。宿泊エリアが県外になる場合は劇場詳細で案内します。</p></div></aside></div></main></SubShell>
}
