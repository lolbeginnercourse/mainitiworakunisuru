export const SITE = {
  name: "GTA6 GUIDE JAPAN",
  origin: "https://mainitiworakunisuru.com",
  verifiedAt: "2026-07-14",
  verifiedLabel: "2026年7月14日"
};

const officialMedia = {
  id: "official-media",
  title: "Grand Theft Auto VI 公式スクリーンショット",
  publisher: "Rockstar Games",
  url: "https://www.rockstargames.com/VI/media/screenshots",
  publishedAt: "2025-05-06",
  checkedAt: SITE.verifiedAt,
  sourceType: "official-page"
};

const sharedUnknownItems = [
  "正確な地域範囲と境界",
  "道路配置と地域間の正確な距離",
  "移動時間とファストトラベルの有無",
  "店舗・施設・ミッション開始地点の位置",
  "収集物や購入可能物件の有無",
  "プレイヤーが立ち入れる範囲"
];

const source = (slug, title) => ({
  id: `official-${slug}`,
  title,
  publisher: "Rockstar Games",
  url: `https://www.rockstargames.com/VI/only-in-leonida/${slug}`,
  publishedAt: "2025-05-06",
  checkedAt: SITE.verifiedAt,
  sourceType: "official-page"
});

export const regions = [
  {
    id: "vice-city",
    slug: "vice-city",
    nameEn: "Vice City",
    nameJa: "バイスシティ",
    nameVariants: ["ViceCity", "バイス・シティ"],
    category: "都市・市街地",
    filterGroups: ["city"],
    tags: ["都市", "市街地", "ネオン", "Leonida"],
    summary: "Leonida州を代表する都市として公式公開され、ネオンに照らされた街並みや都市の文化が公式ページで紹介されています。",
    conclusion: "Vice Cityの名称や都市景観、関係する人物は公式公開済みですが、道路や施設の正確な位置を示す公式地図は未発表です。",
    officialStatus: "official",
    officialImageStatus: "available",
    officialMapStatus: "unreleased",
    sortOrder: 1,
    firstPublishedAt: "2025-05-06",
    lastVerifiedAt: SITE.verifiedAt,
    sources: [source("vice-city", "Grand Theft Auto VI - Vice City"), officialMedia],
    knownFacts: [
      { text: "Rockstar Games公式サイトで独立した地域ページが公開されています。", status: "official", sourceIds: ["official-vice-city"] },
      { text: "公式紹介では、ネオンに照らされた通りを持つ都市として扱われています。", status: "official", sourceIds: ["official-vice-city"] },
      { text: "Vice City名義の公式スクリーンショットが公開されています。", status: "official", sourceIds: ["official-media"] }
    ],
    unknownItems: sharedUnknownItems,
    relatedPeople: [
      { name: "Boobie Ike", relation: "公式紹介でVice Cityの地元の人物として説明されています。", status: "official", sourceIds: ["official-vice-city"] },
      { name: "Dre'Quan Priest", relation: "公式紹介でVice Cityの音楽シーンを目指す人物として説明されています。", status: "official", sourceIds: ["official-vice-city"] }
    ],
    relatedOrganizations: [
      { name: "Only Raw Records", relation: "公式人物紹介内でVice Cityの音楽活動と関係する組織として登場します。", status: "official", sourceIds: ["official-vice-city"] }
    ],
    relatedRegions: ["leonida-keys", "port-gellhorn", "grassrivers"]
  },
  {
    id: "leonida-keys",
    slug: "leonida-keys",
    nameEn: "Leonida Keys",
    nameJa: "レオニダ・キーズ",
    nameVariants: ["LeonidaKeys", "レオニダキーズ"],
    category: "海・島",
    filterGroups: ["sea"],
    tags: ["島", "沿岸", "海", "Keys"],
    summary: "島しょ・沿岸地域として公式公開され、Jason DuvalやBrian Hederの公式紹介にも関係する地域です。",
    conclusion: "Leonida Keysは名称と一部の人物関係、公式画像が公開済みですが、島々の配置や移動経路はまだ確認できません。",
    officialStatus: "official",
    officialImageStatus: "available",
    officialMapStatus: "unreleased",
    sortOrder: 2,
    firstPublishedAt: "2025-05-06",
    lastVerifiedAt: SITE.verifiedAt,
    sources: [source("leonida-keys", "Grand Theft Auto VI - Leonida Keys"), officialMedia],
    knownFacts: [
      { text: "Rockstar Games公式サイトで独立した地域ページが公開されています。", status: "official", sourceIds: ["official-leonida-keys"] },
      { text: "Jason Duvalの公式紹介では、彼がKeysで地元の運び屋に関わっていたことが説明されています。", status: "official", sourceIds: ["official-leonida-keys"] },
      { text: "Leonida Keys名義の公式スクリーンショットが公開されています。", status: "official", sourceIds: ["official-media"] }
    ],
    unknownItems: sharedUnknownItems,
    relatedPeople: [
      { name: "Jason Duval", relation: "公式プロフィールでKeysとの関わりが明記されています。", status: "official", sourceIds: ["official-leonida-keys"] },
      { name: "Brian Heder", relation: "公式紹介でKeysのボートヤードを拠点とする人物として説明されています。", status: "official", sourceIds: ["official-leonida-keys"] }
    ],
    relatedOrganizations: [],
    relatedRegions: ["vice-city", "grassrivers", "port-gellhorn"]
  },
  {
    id: "grassrivers",
    slug: "grassrivers",
    nameEn: "Grassrivers",
    nameJa: "グラスリバーズ",
    nameVariants: ["Grass Rivers", "グラス・リバーズ"],
    category: "自然",
    filterGroups: ["nature"],
    tags: ["自然", "湿地", "水辺", "Leonida"],
    summary: "Rockstar Games公式サイトで独立した地域として公開され、地域名を付けた公式画像も確認できる自然地域です。",
    conclusion: "Grassriversの名称と景観画像は公式公開済みですが、地形の範囲や探索可能地点は現時点で発表されていません。",
    officialStatus: "official",
    officialImageStatus: "available",
    officialMapStatus: "unreleased",
    sortOrder: 3,
    firstPublishedAt: "2025-05-06",
    lastVerifiedAt: SITE.verifiedAt,
    sources: [source("grassrivers", "Grand Theft Auto VI - Grassrivers"), officialMedia],
    knownFacts: [
      { text: "Rockstar Games公式サイトでGrassriversの地域ページが公開されています。", status: "official", sourceIds: ["official-grassrivers"] },
      { text: "Grassrivers名義の公式スクリーンショットが複数公開されています。", status: "official", sourceIds: ["official-media"] }
    ],
    unknownItems: sharedUnknownItems,
    relatedPeople: [],
    relatedOrganizations: [],
    relatedRegions: ["leonida-keys", "port-gellhorn", "mount-kalaga"]
  },
  {
    id: "port-gellhorn",
    slug: "port-gellhorn",
    nameEn: "Port Gellhorn",
    nameJa: "ポート・ゲルホーン",
    nameVariants: ["PortGellhorn", "ポートゲルホーン"],
    category: "海・島",
    filterGroups: ["sea"],
    tags: ["沿岸", "港", "市街地", "Leonida"],
    summary: "Rockstar Games公式サイトで独立した地域として紹介され、地域名を付けた公式画像が公開されています。",
    conclusion: "Port Gellhornは公式地域として公開済みですが、港湾施設の機能や道路配置、ほかの地域との距離は未発表です。",
    officialStatus: "official",
    officialImageStatus: "available",
    officialMapStatus: "unreleased",
    sortOrder: 4,
    firstPublishedAt: "2025-05-06",
    lastVerifiedAt: SITE.verifiedAt,
    sources: [source("port-gellhorn", "Grand Theft Auto VI - Port Gellhorn"), officialMedia],
    knownFacts: [
      { text: "Rockstar Games公式サイトでPort Gellhornの地域ページが公開されています。", status: "official", sourceIds: ["official-port-gellhorn"] },
      { text: "Port Gellhorn名義の公式スクリーンショットが複数公開されています。", status: "official", sourceIds: ["official-media"] }
    ],
    unknownItems: sharedUnknownItems,
    relatedPeople: [],
    relatedOrganizations: [],
    relatedRegions: ["vice-city", "leonida-keys", "ambrosia"]
  },
  {
    id: "ambrosia",
    slug: "ambrosia",
    nameEn: "Ambrosia",
    nameJa: "アンブロシア",
    nameVariants: ["アンブローシア"],
    category: "地方・産業",
    filterGroups: ["rural"],
    tags: ["地方", "産業", "地域", "Leonida"],
    summary: "Rockstar Games公式サイトで独立した地域として公開され、Ambrosia名義の公式画像が用意されています。",
    conclusion: "Ambrosiaは名称と公式画像が公開済みですが、地域の産業施設や活動、正確な位置関係は未発表です。",
    officialStatus: "official",
    officialImageStatus: "available",
    officialMapStatus: "unreleased",
    sortOrder: 5,
    firstPublishedAt: "2025-05-06",
    lastVerifiedAt: SITE.verifiedAt,
    sources: [source("ambrosia", "Grand Theft Auto VI - Ambrosia"), officialMedia],
    knownFacts: [
      { text: "Rockstar Games公式サイトでAmbrosiaの地域ページが公開されています。", status: "official", sourceIds: ["official-ambrosia"] },
      { text: "Ambrosia名義の公式スクリーンショットが複数公開されています。", status: "official", sourceIds: ["official-media"] }
    ],
    unknownItems: sharedUnknownItems,
    relatedPeople: [],
    relatedOrganizations: [],
    relatedRegions: ["port-gellhorn", "grassrivers", "mount-kalaga"]
  },
  {
    id: "mount-kalaga",
    slug: "mount-kalaga",
    nameEn: "Mount Kalaga National Park",
    nameJa: "マウント・カラガ国立公園",
    nameVariants: ["Mount Kalaga", "MountKalaga", "マウントカラガ"],
    category: "山岳",
    filterGroups: ["mountain", "nature"],
    tags: ["山岳", "自然", "国立公園", "Leonida"],
    summary: "Mount Kalaga National Parkの名称で公式画像が公開されている山岳・自然地域です。",
    conclusion: "Mount Kalaga National Parkの名称と景観画像は公式公開済みですが、登山経路や利用できる活動、到達方法は未発表です。",
    officialStatus: "official",
    officialImageStatus: "available",
    officialMapStatus: "unreleased",
    sortOrder: 6,
    firstPublishedAt: "2025-05-06",
    lastVerifiedAt: SITE.verifiedAt,
    sources: [source("mount-kalaga", "Grand Theft Auto VI - Mount Kalaga"), officialMedia],
    knownFacts: [
      { text: "Rockstar Games公式サイトでMount Kalagaの地域ページが用意されています。", status: "official", sourceIds: ["official-mount-kalaga"] },
      { text: "Mount Kalaga National Park名義の公式スクリーンショットが複数公開されています。", status: "official", sourceIds: ["official-media"] }
    ],
    unknownItems: sharedUnknownItems,
    relatedPeople: [],
    relatedOrganizations: [],
    relatedRegions: ["grassrivers", "ambrosia", "leonida-keys"]
  }
];

export const statusLabels = {
  official: "公式公開",
  "visual-confirmed": "公式映像内で確認",
  unreleased: "公式未発表",
  "post-launch": "発売後に確認"
};

export const imageStatusLabels = {
  available: "公開あり",
  unavailable: "公開未確認"
};
