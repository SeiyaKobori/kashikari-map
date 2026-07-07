import { Href, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { BorrowItem, directionColor, directionLabel, dueStatusLabel, formatDateLabel, parseDateKey } from '@/constants/borrowItems';
import { useBorrowLedger } from '@/contexts/BorrowLedgerContext';

type CalendarDay = {
  date: number;
  month: number;
  year: number;
  muted: boolean;
  key: string;
};

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const firstMondayIndex = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();
  const previousLast = new Date(year, month - 1, 0).getDate();
  const totalCells = Math.ceil((firstMondayIndex + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - firstMondayIndex + 1;
    if (dayNumber < 1) {
      const date = previousLast + dayNumber;
      const prevDate = new Date(year, month - 2, date);
      return { date, month: prevDate.getMonth() + 1, year: prevDate.getFullYear(), muted: true, key: `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}-${date}` };
    }
    if (dayNumber > daysInMonth) {
      const date = dayNumber - daysInMonth;
      const nextDate = new Date(year, month, date);
      return { date, month: nextDate.getMonth() + 1, year: nextDate.getFullYear(), muted: true, key: `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${date}` };
    }
    return { date: dayNumber, month, year, muted: false, key: `${year}-${month}-${dayNumber}` };
  });
}

function itemDateKey(item: BorrowItem) {
  const parsed = parseDateKey(item.dueDate);
  if (!parsed) return '';
  return `${parsed.year}-${parsed.month}-${parsed.day}`;
}

function monthTarget(items: BorrowItem[]) {
  const parsed = items.map((item) => parseDateKey(item.dueDate)).find(Boolean);
  return parsed ?? { year: 2026, month: 7, day: 1 };
}

export default function CalendarScreen() {
  const { activeItems } = useBorrowLedger();
  const { width } = useWindowDimensions();
  const target = monthTarget(activeItems);
  const calendarDays = buildCalendarDays(target.year, target.month);
  const cellWidth = width / 7;
  const sortedItems = [...activeItems].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{target.year}年{target.month}月</Text>
        </View>
        <View style={styles.grid}>
          {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
            <Text key={day} style={[styles.dow, { width: cellWidth }]}>{day}</Text>
          ))}
          {calendarDays.map((day) => {
            const items = activeItems.filter((item) => itemDateKey(item) === day.key);
            return (
              <View key={day.key} style={[styles.day, { width: cellWidth }, day.muted && styles.mutedDay]}>
                <Text style={styles.date}>{day.date}</Text>
                {items.slice(0, 2).map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => router.push(`/item/${item.id}` as Href)}
                    style={[styles.dot, { backgroundColor: directionColor(item.direction) }]}>
                    <Text numberOfLines={1} style={styles.dotText}>{item.title}</Text>
                  </Pressable>
                ))}
                {items.length > 2 ? <Text style={styles.moreText}>+{items.length - 2}</Text> : null}
              </View>
            );
          })}
        </View>

        <View style={styles.list}>
          {sortedItems.length > 0 ? sortedItems.map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/item/${item.id}` as Href)} style={styles.calendarItem}>
              <Text style={styles.time}>{formatDateLabel(item.dueDate)}</Text>
              <View style={styles.calendarBody}>
                <Text style={styles.itemTitle}>{item.title} {item.direction === 'lend' ? '→' : '←'} {item.person}</Text>
                <Text style={styles.itemMeta}>{dueStatusLabel(item)}</Text>
              </View>
              <Text style={styles.kind}>{directionLabel(item.direction)}</Text>
            </Pressable>
          )) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>予定はありません</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 110 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  title: { color: theme.text, fontSize: 24, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'stretch' },
  dow: { color: theme.muted, textAlign: 'center', fontSize: 10, fontWeight: '900', paddingBottom: 6, paddingTop: 2 },
  day: { minHeight: 64, borderRadius: 0, borderRightWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.055)', padding: 6 },
  mutedDay: { opacity: 0.38 },
  date: { color: theme.muted, fontSize: 11, fontWeight: '900' },
  dot: { marginTop: 5, borderRadius: 999, paddingHorizontal: 5, paddingVertical: 3 },
  dotText: { color: '#111722', fontSize: 9, fontWeight: '900' },
  moreText: { color: theme.muted, fontSize: 9, marginTop: 3, fontWeight: '900' },
  list: { gap: 8, marginTop: 14, paddingHorizontal: 16 },
  calendarItem: { minHeight: 66, borderRadius: 16, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surface, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10 },
  time: { width: 48, color: '#ffd166', fontWeight: '900', fontSize: 12 },
  calendarBody: { flex: 1 },
  itemTitle: { color: theme.text, fontSize: 13, fontWeight: '900' },
  itemMeta: { color: theme.muted, fontSize: 11, marginTop: 3, fontWeight: '700' },
  kind: { color: theme.muted, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.10)', fontSize: 10, fontWeight: '900' },
  empty: { borderRadius: 18, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surface, padding: 18, alignItems: 'center' },
  emptyTitle: { color: theme.text, fontWeight: '900' },
});
