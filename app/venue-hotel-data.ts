export type Hotel = {
  id: string;
  name: string;
  address: string;
  nearestStation: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  bookingUrl?: string;
  officialUrl?: string;
  luggageStorage?: boolean;
};

export type VenueHotelEntry = {
  hotelId: string;
  rank: number;
  group: "walking" | "transit";
  venueTravelMinutes: number;
  venueTravelLabel?: string;
  travelMode: "walking" | "transit" | "driving";
  priceLabel: string;
  feature: string;
  fitFor?: string;
  caution?: string;
  badges: string[];
};

export type VenueHotelPage = {
  slug: string;
  venueAddress: string;
  intro: string;
  walkingSectionLabel: string;
  transitSectionLabel: string;
  hotels: VenueHotelEntry[];
  choiceCards: Array<{ title: string; text: string }>;
};

export const hotels: Record<string, Hotel> = {};

export const venueHotelPages: Record<string, VenueHotelPage> = {
  "tennozu-galaxy-theatre": {
    slug: "tennozu-galaxy-theatre",
    venueAddress: "東京都品川区東品川2丁目3-16",
    intro: "この劇場周辺のホテル情報は現在見直し中です。掲載準備ができ次第、徒歩圏と電車アクセスのホテルを追加します。",
    walkingSectionLabel: "徒歩で行ける近くのホテル",
    transitSectionLabel: "電車でのアクセスに便利なホテル",
    hotels: [],
    choiceCards: [
      { title: "徒歩で移動したい方", text: "劇場まで徒歩で戻れるホテルなら、終演後の移動負担を減らせます。" },
      { title: "料金を抑えたい方", text: "劇場周辺だけでなく、乗り換えの少ない駅まで範囲を広げて比較します。" },
      { title: "特別感を重視する方", text: "観劇遠征そのものを楽しめる滞在先も比較できるようにします。" },
      { title: "翌日の移動も考える方", text: "品川・羽田方面に出やすい駅近ホテルなら、チェックアウト後の移動も組みやすくなります。" },
    ],
  },
};

export function getVenueHotelEntries(slug: string) {
  const page = venueHotelPages[slug];
  if (!page) return null;

  return {
    ...page,
    hotelEntries: page.hotels
      .map((entry) => ({ entry, hotel: hotels[entry.hotelId] }))
      .filter((item) => item.hotel)
      .sort((a, b) => a.entry.rank - b.entry.rank),
  };
}
