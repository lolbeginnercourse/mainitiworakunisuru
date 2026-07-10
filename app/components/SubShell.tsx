import Link from "next/link";
import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";

export default function SubShell({children}:{children:ReactNode}){
  return <><SiteHeader/>{children}<footer><div className="site-container footer-grid"><div><Link href="/" className="brand brand-footer"><span className="brand-mark">S</span><span>ステージ<span className="pink">泊</span><small>観劇遠征ホテルガイド</small></span></Link><p>劇場を起点に、宿泊エリアとホテルを比較するための非公式専門メディアです。</p></div><div><b>探す</b><Link href="/theaters">劇場一覧</Link><Link href="/areas">宿泊エリア一覧</Link></div><div><b>サイトについて</b><Link href="/about">このサイトについて</Link><Link href="/policy">編集方針</Link><Link href="/contact">お問い合わせ</Link></div><div><b>運営・法務</b><Link href="/legal">運営者情報</Link><Link href="/legal#privacy">プライバシーポリシー</Link></div></div><div className="footer-bottom site-container"><span>※各作品・劇場・ホテルの公式サイトではありません。</span><span>© 2026 ステージ泊</span></div></footer></>;
}
