export type Hotel = {
  id: string;
  name: string;
  address: string;
  nearestStation: string;
  stationWalkMinutes: number;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  bookingUrl: string;
  officialUrl?: string;
  luggageStorage?: boolean;
};

export type VenueHotelEntry = {
  hotelId: string;
  rank: number;
  group: "walking" | "transit";
  venueTravelMinutes: number;
  travelMode: "walking" | "transit" | "driving";
  priceLabel: string;
  feature: string;
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

export const hotels: Record<string, Hotel> = {
  "hotel-template-01": {
    id: "hotel-template-01",
    name: "ホテル名を入力してください 1",
    address: "ホテル住所を入力してください",
    nearestStation: "最寄り駅を入力してください",
    stationWalkMinutes: 2,
    image: "/hotel-images/hotel-near.png",
    imageAlt: "ホテル画像の説明を入力してください",
    bookingUrl: "https://example.com/",
    officialUrl: "https://example.com/",
    luggageStorage: true,
  },
  "hotel-template-02": {
    id: "hotel-template-02",
    name: "ホテル名を入力してください 2",
    address: "ホテル住所を入力してください",
    nearestStation: "最寄り駅を入力してください",
    stationWalkMinutes: 4,
    image: "/hotel-images/hotel-value.png",
    imageAlt: "ホテル画像の説明を入力してください",
    bookingUrl: "https://example.com/",
    officialUrl: "https://example.com/",
    luggageStorage: true,
  },
  "hotel-template-03": {
    id: "hotel-template-03",
    name: "ホテル名を入力してください 3",
    address: "ホテル住所を入力してください",
    nearestStation: "最寄り駅を入力してください",
    stationWalkMinutes: 5,
    image: "/hotel-images/hotel-access.png",
    imageAlt: "ホテル画像の説明を入力してください",
    bookingUrl: "https://example.com/",
    officialUrl: "https://example.com/",
    luggageStorage: true,
  },
  "hotel-template-04": {
    id: "hotel-template-04",
    name: "ホテル名を入力してください 4",
    address: "ホテル住所を入力してください",
    nearestStation: "最寄り駅を入力してください",
    stationWalkMinutes: 3,
    image: "/hotel-images/hotel-value.png",
    imageAlt: "ホテル画像の説明を入力してください",
    bookingUrl: "https://example.com/",
    officialUrl: "https://example.com/",
    luggageStorage: false,
  },
  "hotel-template-05": {
    id: "hotel-template-05",
    name: "ホテル名を入力してください 5",
    address: "ホテル住所を入力してください",
    nearestStation: "最寄り駅を入力してください",
    stationWalkMinutes: 6,
    image: "/hotel-images/hotel-access.png",
    imageAlt: "ホテル画像の説明を入力してください",
    bookingUrl: "https://example.com/",
    officialUrl: "https://example.com/",
    luggageStorage: true,
  },
};

export const venueHotelPages: Record<string, VenueHotelPage> = {
  "tennozu-galaxy-theatre": {
    slug: "tennozu-galaxy-theatre",
    venueAddress: "東京都品川区東品川2丁目3-16",
    intro: "劇場まで徒歩で行けるホテルを中心に、観劇や遠征で利用しやすいホテルを紹介します。",
    walkingSectionLabel: "徒歩で行ける近くのホテル（徒歩5分以内）",
    transitSectionLabel: "電車でのアクセスに便利なホテル",
    hotels: [
      {
        hotelId: "hotel-template-01",
        rank: 1,
        group: "walking",
        venueTravelMinutes: 2,
        travelMode: "walking",
        priceLabel: "15,000円〜",
        feature: "劇場のすぐ近くにあり、終演後も徒歩で戻りやすいホテルです。",
        badges: ["荷物預かり", "徒歩圏", "館内施設あり"],
      },
      {
        hotelId: "hotel-template-02",
        rank: 2,
        group: "walking",
        venueTravelMinutes: 4,
        travelMode: "walking",
        priceLabel: "12,000円〜",
        feature: "徒歩移動を重視しながら、料金とのバランスも確認したい方向けです。",
        badges: ["徒歩圏", "荷物預かり", "駅近"],
      },
      {
        hotelId: "hotel-template-03",
        rank: 3,
        group: "walking",
        venueTravelMinutes: 5,
        travelMode: "walking",
        priceLabel: "9,000円〜",
        feature: "料金を抑えながら劇場まで徒歩で移動したい場合の候補です。",
        badges: ["徒歩圏", "朝食あり", "コスパ重視"],
      },
      {
        hotelId: "hotel-template-04",
        rank: 4,
        group: "transit",
        venueTravelMinutes: 15,
        travelMode: "transit",
        priceLabel: "11,000円〜",
        feature: "主要駅周辺に泊まり、翌日の移動も組みやすくしたい方向けです。",
        badges: ["電車アクセス", "主要駅", "移動しやすい"],
      },
      {
        hotelId: "hotel-template-05",
        rank: 5,
        group: "transit",
        venueTravelMinutes: 18,
        travelMode: "transit",
        priceLabel: "10,000円〜",
        feature: "新幹線や空港利用と組み合わせて宿泊先を選びたい場合に向いています。",
        badges: ["新幹線利用向け", "荷物預かり", "駅近"],
      },
    ],
    choiceCards: [
      { title: "徒歩で移動したい方", text: "劇場まで徒歩で戻れるホテルなら、終演後の移動負担を減らせます。" },
      { title: "電車移動も考える方", text: "主要駅周辺のホテルは、翌日の移動や新幹線利用と組み合わせやすくなります。" },
      { title: "荷物が多い方", text: "荷物預かりに対応しているホテルを選ぶと、観劇前後の移動がしやすくなります。" },
      { title: "一人で宿泊する方", text: "駅から近いホテルや、移動経路が分かりやすいホテルを候補にします。" },
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
