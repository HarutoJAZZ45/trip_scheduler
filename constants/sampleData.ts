import { Spot } from "@/types/spot";

export const SAMPLE_SCHEDULE = [
    {
        day: "Day 1",
        date: "2/27",
        events: [
            {
                id: 101,
                time: "22:05",
                title: "フライト: TK199",
                type: "transit",
                description: "羽田 (HND) 発 → イスタンブール (IST)",
            },
        ],
    },
    {
        day: "Day 2",
        date: "2/28",
        events: [
            {
                id: 201,
                time: "05:40",
                title: "イスタンブール着",
                type: "transit",
                description: "乗り継ぎ待機",
            },
            {
                id: 202,
                time: "07:55",
                title: "フライト: TK1449",
                type: "transit",
                description: "イスタンブール (IST) 発 → ポルト (OPO)",
            },
            {
                id: 203,
                time: "09:55",
                title: "ポルト着",
                type: "activity",
                description: "ポルトガル到着！ ホテルへチェックイン",
            },
        ],
    },
    {
        day: "Day 3",
        date: "3/01",
        events: [
            {
                id: 301,
                time: "10:00",
                title: "ポルト観光",
                type: "activity",
                description: "ポルト市内を散策"
            }
        ]
    },
    {
        day: "Day 4",
        date: "3/02",
        events: [
            {
                id: 401,
                time: "Morning",
                title: "リスボンへ移動",
                type: "transit",
                description: "鉄道またはバスで移動"
            }
        ]
    },
    {
        day: "Day 5",
        date: "3/03",
        events: []
    },
    {
        day: "Day 6",
        date: "3/04",
        events: [
            {
                id: 601,
                time: "Morning",
                title: "マドリードへ移動",
                type: "transit",
                description: "フライトまたは鉄道で移動"
            }
        ]
    },
    {
        day: "Day 7",
        date: "3/05",
        events: []
    },
    {
        day: "Day 8",
        date: "3/06",
        events: []
    },
    {
        day: "Day 9",
        date: "3/07",
        events: [
            {
                id: 901,
                time: "Morning",
                title: "バルセロナへ移動",
                type: "transit",
                description: "鉄道 (Renfe) で移動"
            }
        ]
    },
    {
        day: "Day 10",
        date: "3/08",
        events: [
            {
                id: 1001,
                time: "Afternoon",
                title: "フライト: 帰国",
                type: "transit",
                description: "バルセロナ発"
            }
        ]
    }
];

export const SAMPLE_PACKING = [
    {
        category: "必需品",
        items: [
            { id: '1', name: "パスポート", checked: false },
            { id: '2', name: "eチケット", checked: false },
            { id: '3', name: "クレカ (Wise)", checked: false }
        ]
    },
    {
        category: "ガジェット",
        items: [
            { id: '4', name: "充電器", checked: false },
            { id: '5', name: "変換プラグ", checked: false }
        ]
    },
    {
        category: "衣類",
        items: [
            { id: '6', name: "下着 (5日分)", checked: false },
            { id: '7', name: "羽織もの", checked: false },
            { id: '8', name: "パジャマ", checked: false }
        ]
    },
    {
        category: "洗面用具",
        items: [
            { id: '9', name: "歯ブラシ", checked: false },
            { id: '10', name: "スキンケア", checked: false },
            { id: '11', name: "タオル", checked: false }
        ]
    },
    {
        category: "その他",
        items: [
            { id: '12', name: "常備薬", checked: false },
            { id: '13', name: "エコバッグ", checked: false },
            { id: '14', name: "マスク", checked: false }
        ]
    }
];

export const SAMPLE_MEMBERS = [
    { id: 'm1', name: '自分' },
    { id: 'm2', name: 'Aさん' },
    { id: 'm3', name: 'Bさん' }
];

export const SAMPLE_SPOTS: Spot[] = [
    {
        id: 1,
        name: "Cafe Majestic",
        category: "カフェ",
        location: "Porto",
        rating: 4.8,
        color: "#d4a373"
    },
    {
        id: 2,
        name: "ベレンの塔",
        category: "観光",
        location: "Lisbon",
        rating: 4.7,
        color: "#e07a5f"
    },
    {
        id: 3,
        name: "プラド美術館",
        category: "ミュージアム",
        location: "Madrid",
        rating: 4.9,
        color: "#334155"
    },
    {
        id: 4,
        name: "サグラダ・ファミリア",
        category: "観光",
        location: "Barcelona",
        rating: 4.9,
        color: "#84a98c"
    }
];
