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

  return (
    <article className="hotel-card">
      <div className="hotel-card__media">
        {hotel.image ? (
          <Image
            className="hotel-card__image"
            src={hotel.image}
            alt={hotel.imageAlt}
            width={880}
            height={660}
            loading="lazy"
            style={{ objectPosition: hotel.imagePosition ?? "center center" }}
          />
        ) : (
          <div className="hotel-card__image-placeholder">画像準備中</div>
        )}
        <span className={`hotel-card__distance-badge ${entry.travelMode === "walking" ? "is-walking" : "is-transit"}`}>
          {travelLabel} 約{entry.venueTravelMinutes}分
        </span>
      </div>

      <div className="hotel-card__content">
        <p className="hotel-card__rank">近さ順 No.{entry.rank}</p>
        <h3 className="hotel-card__name">{hotel.name}</h3>
        <dl className="hotel-card__facts">
          <div>
            <dt>劇場まで</dt>
            <dd>{travelLabel} 約{entry.venueTravelMinutes}分</dd>
          </div>
          <div>
            <dt>最寄り駅</dt>
            <dd>{hotel.nearestStation} 徒歩約{hotel.stationWalkMinutes}分</dd>
          </div>
        </dl>
        <p className="hotel-card__feature">{entry.feature}</p>
        <div className="hotel-card__badges">
          {entry.badges.slice(0, 3).map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
      </div>

      <div className="hotel-card__actions">
        <div className="hotel-card__price">
          <span>料金目安</span>
          <b>{entry.priceLabel}</b>
          <small>宿泊日やプランにより変動</small>
        </div>
        <a className="booking-button" href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
          ホテルを予約する
        </a>
        <a className="route-button" href={routeUrl} target="_blank" rel="noopener noreferrer">
          ホテルから劇場までの<br />
          ルートをGoogleマップで見る ↗
        </a>
      </div>
    </article>
  );
}
