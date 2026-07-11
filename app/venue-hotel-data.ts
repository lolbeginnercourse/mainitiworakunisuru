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

export const hotels: Record<string, Hotel> = {
  "ana-holiday-inn-tokyo-bay": {
    id: "ana-holiday-inn-tokyo-bay",
    name: "ANAホリデイ・イン東京ベイ by IHG",
    address: "東京都品川区東品川2-3-15",
    nearestStation: "天王洲アイル駅直結・徒歩約4〜6分",
    image: "/hotel-images/ana-holiday-inn-tokyo-bay.webp",
    imageAlt: "ANAホリデイ・イン東京ベイ by IHGの画像",
    bookingUrl: "",
    luggageStorage: false,
  },
  "toyoko-inn-shinagawa-konan-tennozu-isle": {
    id: "toyoko-inn-shinagawa-konan-tennozu-isle",
    name: "東横INN品川港南口天王洲アイル",
    address: "東京都品川区東品川2-2-35",
    nearestStation: "天王洲アイル駅 徒歩約5分",
    image: "",
    imageAlt: "東横INN品川港南口天王洲アイルの画像",
    bookingUrl: "",
    luggageStorage: false,
  },
  "petals-tokyo": {
    id: "petals-tokyo",
    name: "PETALS TOKYO",
    address: "東京都品川区東品川2-1 T-LOTUS M",
    nearestStation: "りんかい線 天王洲アイル駅B出口 徒歩約7分／モノレール中央口 徒歩約8分",
    image: "",
    imageAlt: "PETALS TOKYOの画像",
    bookingUrl: "",
    luggageStorage: false,
  },
  "super-hotel-shinagawa-shinbanba": {
    id: "super-hotel-shinagawa-shinbanba",
    name: "スーパーホテル品川・新馬場 高濃度炭酸泉 七福神の湯",
    address: "東京都品川区北品川2-30-26",
    nearestStation: "京急 新馬場駅北口 徒歩約5分",
    image: "",
    imageAlt: "スーパーホテル品川・新馬場 高濃度炭酸泉 七福神の湯の画像",
    bookingUrl: "",
    luggageStorage: false,
  },
  "keikyu-ex-inn-shinagawa-shinbanba": {
    id: "keikyu-ex-inn-shinagawa-shinbanba",
    name: "京急EXイン 品川・新馬場駅北口",
    address: "東京都品川区北品川2-18-1",
    nearestStation: "京急 新馬場駅北口すぐ",
    image: "",
    imageAlt: "京急EXイン 品川・新馬場駅北口の画像",
    bookingUrl: "",
    luggageStorage: false,
  },
  "hearton-hotel-higashi-shinagawa": {
    id: "hearton-hotel-higashi-shinagawa",
    name: "ハートンホテル東品川",
    address: "東京都品川区東品川4-13-27",
    nearestStation: "りんかい線 品川シーサイド駅A出口 徒歩約1分",
    image: "",
    imageAlt: "ハートンホテル東品川の画像",
    bookingUrl: "",
    luggageStorage: false,
  },
};

export const venueHotelPages: Record<string, VenueHotelPage> = {
  "tennozu-galaxy-theatre": {
    slug: "tennozu-galaxy-theatre",
    venueAddress: "東京都品川区東品川2丁目3-16",
    intro: "劇場まで徒歩で行けるホテルを中心に、観劇や遠征で利用しやすいホテルを紹介します。",
    walkingSectionLabel: "徒歩で行ける近くのホテル",
    transitSectionLabel: "電車でのアクセスに便利なホテル",
    hotels: [
      {
        hotelId: "ana-holiday-inn-tokyo-bay",
        rank: 1,
        group: "walking",
        venueTravelMinutes: 2,
        venueTravelLabel: "徒歩約2分／約91m",
        travelMode: "walking",
        priceLabel: "2名1室 約24,800円〜",
        feature: "劇場のほぼ隣にあるベイビュー系ホテル。観劇前後の移動負担を最小にしたい人向け。",
        fitFor: "劇場からの近さを最優先したい人向け",
        caution: "注意：宿泊料金は周辺候補より高め",
        badges: ["近さ順 No.1", "徒歩5分以内"],
      },
      {
        hotelId: "toyoko-inn-shinagawa-konan-tennozu-isle",
        rank: 2,
        group: "walking",
        venueTravelMinutes: 6,
        venueTravelLabel: "徒歩約5〜6分",
        travelMode: "walking",
        priceLabel: "2名1室 約11,800円〜17,500円前後",
        feature: "劇場近くで価格を抑えやすい定番ビジネスホテル。無料朝食付きで遠征利用にも使いやすい。",
        fitFor: "徒歩圏で宿泊費を抑えたい人向け",
        caution: "注意：公演日や週末は料金・空室が変わりやすい",
        badges: ["料金重視", "徒歩圏"],
      },
      {
        hotelId: "petals-tokyo",
        rank: 3,
        group: "walking",
        venueTravelMinutes: 7,
        venueTravelLabel: "徒歩約5〜7分／約370m",
        travelMode: "walking",
        priceLabel: "2名1室 約64,800円〜／朝食付き約71,100円〜",
        feature: "天王洲運河に浮かぶ水上ホテル。価格は高いが、特別感を出したい滞在向け。",
        fitFor: "観劇遠征そのものを特別な滞在にしたい人向け",
        caution: "注意：料金は高めで、宿泊費より体験重視の日程向き",
        badges: ["特別な滞在向け", "徒歩圏"],
      },
      {
        hotelId: "super-hotel-shinagawa-shinbanba",
        rank: 4,
        group: "walking",
        venueTravelMinutes: 16,
        venueTravelLabel: "徒歩約13〜16分／約926m",
        travelMode: "walking",
        priceLabel: "2名1室 朝食付き 約9,900円〜13,000円前後",
        feature: "劇場から徒歩圏内で、炭酸泉と朝食付きが強み。終演後に少し歩いても宿代を抑えたい人向け。",
        fitFor: "少し歩いても宿泊費を抑えたい人向け",
        caution: "注意：終演後に歩く距離が伸びる",
        badges: ["料金重視", "京急線に便利"],
      },
      {
        hotelId: "keikyu-ex-inn-shinagawa-shinbanba",
        rank: 5,
        group: "walking",
        venueTravelMinutes: 22,
        venueTravelLabel: "徒歩約18〜22分",
        travelMode: "walking",
        priceLabel: "2名1室 約8,600円〜／日によって変動",
        feature: "新馬場駅直結で雨の日に強い。劇場最寄りではないが、品川・羽田方面の移動を重視する人向け。",
        fitFor: "翌日に品川駅・羽田空港方面へ動きたい人向け",
        caution: "注意：劇場から徒歩で戻るには距離がある",
        badges: ["羽田空港に便利", "料金重視"],
      },
      {
        hotelId: "hearton-hotel-higashi-shinagawa",
        rank: 6,
        group: "transit",
        venueTravelMinutes: 15,
        venueTravelLabel: "電車利用 約10〜15分／徒歩約22〜25分",
        travelMode: "transit",
        priceLabel: "2名1室 約10,160円〜",
        feature: "品川シーサイド駅前の大型ホテル。徒歩だと少し距離はあるが、りんかい線1駅で劇場最寄りに出られる。",
        fitFor: "徒歩距離より、駅近と料金のバランスを見たい人向け",
        caution: "注意：劇場までは電車移動前提で検討したい距離",
        badges: ["駅近", "電車移動向け"],
      },
    ],
    choiceCards: [
      { title: "徒歩で移動したい方", text: "劇場まで徒歩で戻れるホテルなら、終演後の移動負担を減らせます。" },
      { title: "料金を抑えたい方", text: "新馬場方面まで範囲を広げると、劇場近くでも料金を抑えやすくなります。" },
      { title: "特別感を重視する方", text: "運河沿いやベイビュー系のホテルは、観劇遠征そのものを楽しみたい時に向いています。" },
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
