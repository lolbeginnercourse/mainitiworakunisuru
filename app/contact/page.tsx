import type {Metadata} from "next";
import Link from "next/link";
import SubShell from "../components/SubShell";
import ContactForm from "../components/ContactForm";

export const metadata:Metadata={title:"お問い合わせ｜ステージ泊",description:"掲載情報の修正依頼、施設関係者からの連絡、広告・提携に関するお問い合わせを受け付けています。"};
export default function Contact(){return <SubShell><main><section className="subhero"><div className="site-container"><div className="breadcrumbs"><Link href="/">ホーム</Link> › お問い合わせ</div><h1>お問い合わせ</h1><p>掲載情報の修正依頼、施設関係者からのご連絡を受け付けています。</p></div></section><div className="site-container content-layout"><article className="content-card"><h2>お問い合わせフォーム</h2><p>掲載情報の修正依頼には、対象ページ、修正箇所、確認できる公式情報のURLをご記入ください。</p><ContactForm/></article><aside><div className="side-card"><b>ご記入いただきたい内容</b><p>対象の劇場・ホテル名</p><p>修正が必要な項目</p><p>公式情報の確認先</p></div></aside></div></main></SubShell>}
