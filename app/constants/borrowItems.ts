export type BorrowDirection = 'lend' | 'borrow';

export type BorrowItem = {
  id: string;
  title: string;
  person: string;
  personIcon: string;
  direction: BorrowDirection;
  categoryIcon: string;
  dueDate: string;
  reminderDays: number;
  memo: string;
  completedAt?: string;
  map: {
    itemLeft: number;
    itemTop: number;
    personLeft: number;
    personTop: number;
  };
};

export type NewBorrowItemInput = {
  title: string;
  person: string;
  personIcon: string;
  direction: BorrowDirection;
  categoryIcon: string;
  dueDate: string;
  reminderDays: number;
  memo: string;
};

export const LEND_COLOR = '#ff7a45';
export const BORROW_COLOR = '#45c7ff';
export const WARNING_COLOR = '#ffd166';
export const DANGER_COLOR = '#ff4d6d';

export const initialBorrowItems: BorrowItem[] = [];
export const initialCompletedItems: BorrowItem[] = [];

export function directionColor(direction: BorrowDirection) {
  return direction === 'lend' ? LEND_COLOR : BORROW_COLOR;
}

export function directionLabel(direction: BorrowDirection) {
  return direction === 'lend' ? '貸出' : '借入';
}

export function directionActionLabel(direction: BorrowDirection) {
  return direction === 'lend' ? '返却済みにする' : '返済・返却済みにする';
}

export function formatDateLabel(dateText: string) {
  const parts = dateText.split('-');
  if (parts.length !== 3) return dateText;
  return `${Number(parts[1])}/${Number(parts[2])}`;
}

export function parseDateKey(dateText: string) {
  const [year, month, day] = dateText.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return { year, month, day };
}

export function daysUntil(dateText: string) {
  const parsed = parseDateKey(dateText);
  if (!parsed) return undefined;
  const target = Date.UTC(parsed.year, parsed.month - 1, parsed.day);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

export function dueStatusLabel(item: BorrowItem) {
  const diff = daysUntil(item.dueDate);
  if (diff === undefined) return item.dueDate;
  if (diff < 0) return `${Math.abs(diff)}日超過`;
  if (diff === 0) return '今日・本日中は期限内';
  if (diff <= item.reminderDays) return `${diff}日後・リマインド対象`;
  return `${formatDateLabel(item.dueDate)} 予定`;
}

export function makeMapPosition(index: number) {
  const positions = [
    { itemLeft: 172, itemTop: 198, personLeft: 40, personTop: 74 },
    { itemLeft: 510, itemTop: 226, personLeft: 692, personTop: 80 },
    { itemLeft: 188, itemTop: 596, personLeft: 52, personTop: 766 },
    { itemLeft: 526, itemTop: 604, personLeft: 680, personTop: 776 },
    { itemLeft: 158, itemTop: 404, personLeft: 74, personTop: 388 },
    { itemLeft: 548, itemTop: 420, personLeft: 706, personTop: 404 },
    { itemLeft: 326, itemTop: 116, personLeft: 374, personTop: 36 },
    { itemLeft: 324, itemTop: 720, personLeft: 374, personTop: 810 },
  ];
  return positions[index % positions.length];
}

export function normalizeOneCharacterIcon(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const Segmenter = Intl.Segmenter as new (locale?: string, options?: { granularity: 'grapheme' }) => Intl.Segmenter;
    const segmenter = new Segmenter('ja', { granularity: 'grapheme' });
    const first = segmenter.segment(trimmed)[Symbol.iterator]().next().value as Intl.SegmentData | undefined;
    return first?.segment ?? '';
  }
  return Array.from(trimmed)[0] ?? '';
}
