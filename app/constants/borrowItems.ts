export type BorrowDirection = 'lend' | 'borrow';

export type BorrowItem = {
  id: string;
  title: string;
  person: string;
  personIcon: string;
  direction: BorrowDirection;
  categoryIcon: string;
  dueLabel: string;
  detailStatus: string;
  memo: string;
  calendarDay: string;
  calendarNote: string;
  completed?: boolean;
  map: {
    itemLeft: number;
    itemTop: number;
    personLeft: number;
    personTop: number;
  };
};

export const LEND_COLOR = '#ff7a45';
export const BORROW_COLOR = '#45c7ff';
export const WARNING_COLOR = '#ffd166';
export const DANGER_COLOR = '#ff4d6d';

export const borrowItems: BorrowItem[] = [
  {
    id: 'zelda',
    title: 'ゼルダSwitch',
    person: '佐藤',
    personIcon: '👨‍💼',
    direction: 'lend',
    categoryIcon: '🎮',
    dueLabel: '明日20:00',
    detailStatus: '返却待ち',
    memo: 'ケース付き。返却時に動作確認。',
    calendarDay: '6/29',
    calendarNote: '明日20:00返却予定',
    map: { itemLeft: 172, itemTop: 198, personLeft: 40, personTop: 74 },
  },
  {
    id: 'money',
    title: '¥4,500',
    person: '山田',
    personIcon: '🧑‍🎨',
    direction: 'borrow',
    categoryIcon: '¥',
    dueLabel: '6月30日',
    detailStatus: '返済待ち',
    memo: '山田から借りている。6月30日返済予定。',
    calendarDay: '6/30',
    calendarNote: '返済予定日',
    map: { itemLeft: 510, itemTop: 226, personLeft: 692, personTop: 80 },
  },
  {
    id: 'book',
    title: '技術書',
    person: '兄',
    personIcon: '👨',
    direction: 'lend',
    categoryIcon: '📘',
    dueLabel: '今日',
    detailStatus: '本日中は期限内',
    memo: '当日中は期限内。返却されたら詳細からすぐ完了にできます。',
    calendarDay: '今日',
    calendarNote: '本日中は期限内',
    map: { itemLeft: 188, itemTop: 596, personLeft: 52, personTop: 766 },
  },
  {
    id: 'charger',
    title: '充電器',
    person: '友人A',
    personIcon: '🙂',
    direction: 'borrow',
    categoryIcon: '🔌',
    dueLabel: '今週中',
    detailStatus: '返却予定',
    memo: 'USB-C 65W。週末会う時に返す。',
    calendarDay: '7/4',
    calendarNote: '今週中に返却',
    map: { itemLeft: 526, itemTop: 604, personLeft: 680, personTop: 776 },
  },
  {
    id: 'boardgame',
    title: 'ボードゲーム',
    person: '同僚',
    personIcon: '🧑‍💻',
    direction: 'lend',
    categoryIcon: '🎲',
    dueLabel: '来週',
    detailStatus: '返却待ち',
    memo: '箱と説明書あり。',
    calendarDay: '来週',
    calendarNote: '来週返却予定',
    map: { itemLeft: 158, itemTop: 404, personLeft: 74, personTop: 388 },
  },
  {
    id: 'umbrella',
    title: '傘',
    person: '母',
    personIcon: '👩',
    direction: 'borrow',
    categoryIcon: '☂️',
    dueLabel: '今日',
    detailStatus: '返却予定',
    memo: '帰宅時に返す。',
    calendarDay: '今日',
    calendarNote: '今日返す',
    map: { itemLeft: 548, itemTop: 420, personLeft: 706, personTop: 404 },
  },
];

export const completedItems: BorrowItem[] = [
  {
    ...borrowItems[0],
    id: 'completed-game',
    title: 'マリオカート',
    dueLabel: '返却済み',
    detailStatus: '返却済み',
    memo: '6/20に返却済み。',
    completed: true,
  },
  {
    ...borrowItems[1],
    id: 'completed-money',
    title: '¥1,200',
    dueLabel: '返済済み',
    detailStatus: '返済済み',
    memo: 'ランチ代を返済済み。',
    completed: true,
  },
];

export function directionColor(direction: BorrowDirection) {
  return direction === 'lend' ? LEND_COLOR : BORROW_COLOR;
}

export function directionLabel(direction: BorrowDirection) {
  return direction === 'lend' ? '貸出' : '借入';
}
