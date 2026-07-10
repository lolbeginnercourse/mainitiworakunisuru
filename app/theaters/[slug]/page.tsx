import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HotelCard from "../../components/HotelCard";
import SubShell from "../../components/SubShell";
import { areas, theaters } from "../../site-data";
import { getVenueHotelEntries } from "../../venue-hotel-data";

const tocItems = [
  { id: "walking-hotels", label: "徒歩で行ける近くのホテル" },
  { id: "transit-hotels", label: "電車でのアクセスに便利なホテル" },
  { id: "choice-points", label: "ホテル選びのポイント" },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const theater = theaters.find((item) => item.slug === slug);
  if (!theater) return {};

  return {
    title: `${theater.name}近くのホテル｜徒歩・電車で行きやすい宿`,
    description: `${theater.name}近くのホテルを、徒歩で行ける宿と電車でアクセスしやすい宿に分けて比較できます。料金目安、最寄り駅、荷物預かり、劇場までのルートを確認できます。`,
  };
}

export default async function TheaterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theater = theaters.find((item) => item.slug === slug);
  if (!theater) notFound();

  const venueData = getVenueHotelEntries(slug);
  if (!venueData) notFound();

  const venueAddress = venueData.venueAddress;
  const stationWalkMinutes = 1;
  const walkingHotels = venueData.hotelEntries.filter(({ entry }) => entry.group === "walking");
  const transitHotels = venueData.hotelEntries.filter(({ entry }) => entry.group === "transit");
  const relatedAreas = areas.filter((area) => area.relations.some((relation) => relation.theaterSlug === theater.slug));
  const relatedTheaters = theaters.filter((item) => item.slug !== theater.slug && item.prefecture === theater.prefecture).slice(0, 3);

  return (
    <SubShell>
      <main>
        <div className="venue-page page-container">
          <nav className="venue-breadcrumbs" aria-label="パンくずリスト">
            <Link href="/">ホーム</Link>
            <span>›</span>
            <Link href="/theaters">劇場一覧</Link>
            <span>›</span>
            <Link href={`/theaters?prefecture=${encodeURIComponent(theater.prefecture)}`}>{theater.prefecture}</Link>
            <span>›</span>
            <span>{theater.name}近くのホテル</span>
          </nav>

          <section className="venue-hero">
            <div className="venue-hero__content">
              <p className="eyebrow">THEATER HOTEL GUIDE</p>
              <h1>{theater.name}近くのホテル</h1>
              <p className="venue-hero__intro">{venueData.intro}</p>
              <dl className="venue-hero__details">
                <div>
                  <dt>住所</dt>
                  <dd>{venueAddress}</dd>
                </div>
                <div>
                  <dt>最寄り駅</dt>
                  <dd>{theater.station} 徒歩約{stationWalkMinutes}分</dd>
                </div>
              </dl>
            </div>
            <div className="venue-hero__visual">
              <div className="venue-hero__placeholder">会場画像準備中</div>
              <span className="venue-hero__station-badge">{theater.station}から徒歩約{stationWalkMinutes}分</span>
            </div>
          </section>

          <section className="venue-nav-grid" aria-label="ページ内ナビゲーション">
            <div className="venue-toc">
              <h2>目次</h2>
              <ol>
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="venue-guide-card">
              <span className="guide-icon is-walking">歩</span>
              <h2>徒歩で行けるホテル</h2>
              <p>劇場まで徒歩で戻りやすいホテルを中心に掲載します。</p>
            </div>
            <div className="venue-guide-card">
              <span className="guide-icon is-transit">電</span>
              <h2>電車アクセスも便利</h2>
              <p>主要駅周辺など、翌日の移動も組みやすい候補を比較します。</p>
            </div>
            <div className="venue-guide-card">
              <span className="guide-icon is-service">荷</span>
              <h2>観劇にうれしいサービス</h2>
              <p>荷物預かりや駅近など、観劇前後に便利な条件を確認できます。</p>
            </div>
          </section>

          <section id="walking-hotels" className="venue-section">
            <h2 className="section-title">{venueData.walkingSectionLabel}</h2>
            <div className="hotel-list is-vertical">
              {walkingHotels.map(({ entry, hotel }) => (
                <HotelCard key={entry.hotelId} hotel={hotel} entry={entry} venueAddress={venueAddress} />
              ))}
            </div>
          </section>

          <section id="transit-hotels" className="venue-section">
            <h2 className="section-title">{venueData.transitSectionLabel}</h2>
            <div className="hotel-list is-vertical">
              {transitHotels.map(({ entry, hotel }) => (
                <HotelCard key={entry.hotelId} hotel={hotel} entry={entry} venueAddress={venueAddress} />
              ))}
            </div>
          </section>

          <section id="choice-points" className="venue-section">
            <h2 className="section-title">ホテル選びのポイント</h2>
            <div className="choice-grid">
              {venueData.choiceCards.map((card) => (
                <article className="choice-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </section>

          {(relatedAreas.length > 0 || relatedTheaters.length > 0) && (
            <section className="venue-section related-section">
              <h2 className="section-title">関連するページ</h2>
              <div className="related-grid">
                {relatedAreas.map((area) => (
                  <Link href={`/areas/${area.slug}`} key={area.slug}>{area.name}エリアを見る</Link>
                ))}
                {relatedTheaters.map((item) => (
                  <Link href={`/theaters/${item.slug}`} key={item.slug}>{item.name}近くのホテル</Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </SubShell>
  );
}
