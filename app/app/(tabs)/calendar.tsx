import { Href, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { borrowItems, directionColor, directionLabel } from '@/constants/borrowItems';

const calendarDays = Array.from({ length: 35 }, (_, index) => {
  const start = 25;
  const raw = start + index;
  const date = raw <= 30 ? raw : raw - 30;
  const muted = index < 6 || index > 29;
  return { date, muted };
});

function itemForDate(date: number) {
  if (date === 27) return borrowItems.find((item) => item.id === 'book');
  if (date === 29) return borrowItems.find((item) => item.id === 'zelda');
  if (date === 30) return borrowItems.find((item) => item.id === 'money');
  if (date === 4) return borrowItems.find((item) => item.id === 'charger');
  return undefined;
}

export default function CalendarScreen() {
  const { width } = useWindowDimensions();
  const cellWidth = width / 7;

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>2026年6月</Text>
        </View>
        <View style={styles.grid}>
          {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
            <Text key={day} style={[styles.dow, { width: cellWidth }]}>{day}</Text>
          ))}
          {calendarDays.map((day, index) => {
            const item = itemForDate(day.date);
            const isToday = day.date === 27 && !day.muted;
            return (
              <View key={`${day.date}-${index}`} style={[styles.day, { width: cellWidth }, day.muted && styles.mutedDay, isToday && styles.today]}>
                <Text style={styles.date}>{day.date}</Text>
                {item ? (
                  <Pressable
                    onPress={() => router.push(`/item/${item.id}` as Href)}
                    style={[styles.dot, { backgroundColor: directionColor(item.direction) }]}>
                    <Text numberOfLines={1} style={styles.dotText}>{item.title}</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.list}>
          {borrowItems.slice(0, 4).map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/item/${item.id}` as Href)}
              style={styles.calendarItem}>
              <Text style={styles.time}>{item.calendarDay}</Text>
              <View style={styles.calendarBody}>
                <Text style={styles.itemTitle}>{item.title} {item.direction === 'lend' ? '→' : '←'} {item.person}</Text>
                <Text style={styles.itemMeta}>{item.id === 'book' ? '本日中は期限内' : item.calendarNote}</Text>
              </View>
              <Text style={styles.kind}>{directionLabel(item.direction)}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'stretch',
  },
  dow: {
    color: theme.muted,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '900',
    paddingBottom: 6,
    paddingTop: 2,
  },
  day: {
    minHeight: 64,
    borderRadius: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.055)',
    padding: 6,
  },
  mutedDay: {
    opacity: 0.38,
  },
  today: {
    borderColor: '#ffd166',
    borderWidth: 2,
    backgroundColor: 'rgba(255,209,102,0.11)',
  },
  date: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: '900',
  },
  dot: {
    marginTop: 5,
    borderRadius: 999,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  dotText: {
    color: '#111722',
    fontSize: 9,
    fontWeight: '900',
  },
  list: {
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 16,
  },
  calendarItem: {
    minHeight: 66,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.line,
    backgroundColor: theme.surface,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  time: {
    width: 48,
    color: '#ffd166',
    fontWeight: '900',
    fontSize: 12,
  },
  calendarBody: {
    flex: 1,
  },
  itemTitle: {
    color: theme.text,
    fontSize: 13,
    fontWeight: '900',
  },
  itemMeta: {
    color: theme.muted,
    fontSize: 11,
    marginTop: 3,
    fontWeight: '700',
  },
  kind: {
    color: theme.muted,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.10)',
    fontSize: 10,
    fontWeight: '900',
  },
});
