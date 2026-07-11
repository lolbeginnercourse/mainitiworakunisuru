import Image from "next/image";
import { createGoogleMapsRouteUrl } from "../lib/maps";
import type { Hotel, VenueHotelEntry } from "../venue-hotel-data";

type HotelCardProps = {
  hotel: Hotel;
  entry: VenueHotelEntry;
  venueAddress: string;
};

export default function HotelCard({ hotel, entry, venueAddress }: HotelCardProps) {
  const routeUrl = createGoogleMapsRouteUrl(
    hotel.address,
    venueAddress,
    entry.travelMode,
  );
  const travelLabel = entry.travelMode === "walking" ? "徒歩" : entry.travelMode === "transit" ? "電車＋徒歩" : "車";
  const venueTravelLabel = entry.venueTravelLabel ?? `${travelLabel} 約${entry.venueTravelMinutes}分`;
  const jalanUrl = `https://www.jalan.net/uw/uwp2011/uww2011init.do?keyword=${encodeURIComponent(hotel.name)}`;
  const rakutenUrl = `https://kw.travel.rakuten.co.jp/keyword/Search.do?charset=utf-8&f_max=30&f_query=${encodeURIComponent(hotel.name)}`;
  const fitFor = entry.fitFor ?? entry.feature;
  const detailId = `${entry.hotelId}-details`;
  const routeButtonLabel = entry.travelMode === "walking" ? "徒歩ルートを見る" : "劇場までのルートを見る";

  return (
    <article id={entry.hotelId} className="hotel-card">
      <div className="hotel-card__content">
        {hotel.image && (
          <Image
            className="hotel-card__image hotel-card__image--mobile"
            src={hotel.image}
            alt={hotel.imageAlt ?? `${hotel.name}の外観`}
            width={880}
            height={660}
            loading="lazy"
            style={{ objectPosition: hotel.imagePosition ?? "center center" }}
          />
        )}
        <div className="hotel-card__badges" aria-label={`${hotel.name}の特徴`}>
          <span>近さ順 No.{entry.rank}</span>
          {entry.badges.slice(0, 1).map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
        <h3 className="hotel-card__name">{hotel.name}</h3>
        <dl className="hotel-card__summary-facts">
          <div>
            <dt>劇場まで</dt>
            <dd>{venueTravelLabel}</dd>
          </div>
          <div>
            <dt>料金目安</dt>
            <dd>{entry.priceLabel}</dd>
          </div>
        </dl>
        <p className="hotel-card__fit">{fitFor}</p>
        {entry.caution && (
          <p className="hotel-card__caution">{entry.caution}</p>
        )}
        <div className="hotel-card__actions is-mobile-primary">
          <div className="booking-links" aria-label={`${hotel.name}の予約サイト`}>
            <a className="booking-button is-jalan" href={jalanUrl} target="_blank" rel="noopener noreferrer">
              じゃらんで見る
            </a>
            <a className="booking-button is-rakuten" href={rakutenUrl} target="_blank" rel="noopener noreferrer">
              楽天トラベルで見る
            </a>
          </div>
          <a className="route-button" href={routeUrl} target="_blank" rel="noopener noreferrer">
            {routeButtonLabel}
          </a>
        </div>
        <details className="hotel-card__details">
          <summary aria-controls={detailId} aria-label={`${hotel.name}のホテル情報を詳しく見る`}>
            <span className="summary-closed">ホテル情報を詳しく見る</span>
            <span className="summary-open">ホテル情報を閉じる</span>
          </summary>
          <div id={detailId}>
            <dl className="hotel-card__detail-list">
              <div>
                <dt>最寄り駅</dt>
                <dd>{hotel.nearestStation}</dd>
              </div>
              <div>
                <dt>特徴</dt>
                <dd>{entry.feature}</dd>
              </div>
            </dl>
            {hotel.officialUrl && (
              <a className="hotel-card__official-link" href={hotel.officialUrl} target="_blank" rel="noopener noreferrer">
                公式サイトを見る
              </a>
            )}
          </div>
        </details>
      </div>

      <div className="hotel-card__actions">
        {hotel.image && (
          <Image
            className="hotel-card__image hotel-card__image--desktop"
            src={hotel.image}
            alt={hotel.imageAlt ?? `${hotel.name}の外観`}
            width={440}
            height={330}
            loading="lazy"
            style={{ objectPosition: hotel.imagePosition ?? "center center" }}
          />
        )}
        <div className="hotel-card__price">
          <span>料金目安</span>
          <b>{entry.priceLabel}</b>
          <small>宿泊日やプランにより変動</small>
        </div>
        <div className="booking-links" aria-label={`${hotel.name}の予約サイト`}>
          <a className="booking-button is-jalan" href={jalanUrl} target="_blank" rel="noopener noreferrer">
            じゃらんで見る
          </a>
          <a className="booking-button is-rakuten" href={rakutenUrl} target="_blank" rel="noopener noreferrer">
            楽天トラベルで見る
          </a>
        </div>
        <a className="route-button" href={routeUrl} target="_blank" rel="noopener noreferrer">
          {routeButtonLabel}
        </a>
      </div>
    </article>
  );
}
