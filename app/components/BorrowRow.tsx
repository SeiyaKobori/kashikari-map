import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BorrowItem, directionColor } from '@/constants/borrowItems';
import { theme } from '@/components/AppShell';

type Props = {
  item: BorrowItem;
  showDue?: boolean;
  compact?: boolean;
};

export function BorrowRow({ item, showDue = true, compact = false }: Props) {
  const color = directionColor(item.direction);
  const arrow = item.direction === 'lend' ? '→' : '←';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/item/${item.id}` as Href)}
      style={({ pressed }) => [
        styles.row,
        compact && styles.compact,
        {
          borderColor: `${color}66`,
          backgroundColor: item.direction === 'lend' ? 'rgba(255,122,69,0.20)' : 'rgba(69,199,255,0.20)',
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <View style={[styles.iconBox, { backgroundColor: `${color}33` }]}>
        <Text style={styles.icon}>{item.categoryIcon}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{item.title} {arrow} {item.person}</Text>
        {showDue ? <Text style={styles.meta}>{item.dueLabel}</Text> : null}
      </View>
      <Text style={styles.badge}>詳細</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compact: {
    minHeight: 64,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 19,
    color: theme.text,
    fontWeight: '900',
  },
  body: {
    flex: 1,
  },
  title: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '800',
  },
  meta: {
    color: theme.muted,
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  badge: {
    color: theme.muted,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 7,
    fontSize: 11,
    fontWeight: '800',
  },
});
