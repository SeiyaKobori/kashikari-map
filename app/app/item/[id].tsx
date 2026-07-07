import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { directionActionLabel, directionColor, directionLabel, dueStatusLabel, formatDateLabel } from '@/constants/borrowItems';
import { useBorrowLedger } from '@/contexts/BorrowLedgerContext';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findItem, activeItems, completedItems, completeItem } = useBorrowLedger();
  const item = id ? findItem(id) : undefined;
  const isCompleted = Boolean(item?.completedAt);

  if (!item) {
    return (
      <AppShell>
        <ScrollView contentContainerStyle={styles.container}>
          <Pressable onPress={() => router.replace('/(tabs)/list')} style={styles.backButton}>
            <Text style={styles.backText}>‹ 一覧へ</Text>
          </Pressable>
          <View style={styles.infoBox}>
            <Text style={styles.value}>対象の貸し借りが見つかりません。</Text>
          </View>
        </ScrollView>
      </AppShell>
    );
  }

  const currentItem = item;
  const color = directionColor(currentItem.direction);

  function handleComplete() {
    completeItem(currentItem.id);
    router.replace({ pathname: '/(tabs)/list', params: { filter: 'completed' } });
  }

  return (
    <AppShell>
      <Stack.Screen options={{ title: '詳細' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ 戻る</Text>
        </Pressable>

        <View style={[styles.hero, { borderColor: `${color}66`, backgroundColor: item.direction === 'lend' ? 'rgba(255,122,69,0.18)' : 'rgba(69,199,255,0.18)' }]}>
          <Text style={styles.heroIcon}>{item.categoryIcon}</Text>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <Text style={styles.heroMeta}>{item.person} {item.direction === 'lend' ? 'へ貸出中' : 'から借りている'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>状態</Text>
          <Text style={styles.value}>{isCompleted ? `完了済み / ${item.completedAt ? formatDateLabel(item.completedAt) : ''}` : dueStatusLabel(item)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>種別</Text>
          <Text style={styles.value}>{directionLabel(item.direction)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>返却・返済予定日</Text>
          <Text style={styles.value}>{formatDateLabel(item.dueDate)} / {item.reminderDays}日前にリマインド</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>メモ</Text>
          <Text style={styles.value}>{item.memo}</Text>
        </View>

        <View style={styles.timeline}>
          <Text style={styles.timelineTitle}>記録</Text>
          <Text style={styles.timelineRow}>● 登録中の件数: {activeItems.length}件</Text>
          <Text style={styles.timelineRow}>● 完了済み: {completedItems.length}件</Text>
          <Text style={styles.timelineRow}>● この詳細から完了処理まで実行できます</Text>
        </View>

        {!isCompleted ? (
          <Pressable accessibilityRole="button" onPress={handleComplete} style={styles.primary}>
            <Text style={styles.primaryText}>{directionActionLabel(item.direction)}</Text>
          </Pressable>
        ) : (
          <Pressable accessibilityRole="button" onPress={() => router.replace({ pathname: '/(tabs)/list', params: { filter: 'completed' } })} style={styles.secondary}>
            <Text style={styles.secondaryText}>返却済み一覧へ戻る</Text>
          </Pressable>
        )}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 10, paddingRight: 18 },
  backText: { color: theme.text, fontSize: 16, fontWeight: '900' },
  hero: { borderWidth: 1, borderRadius: 22, padding: 18, marginBottom: 10 },
  heroIcon: { fontSize: 28, marginBottom: 8 },
  heroTitle: { color: theme.text, fontSize: 24, fontWeight: '900' },
  heroMeta: { color: theme.muted, marginTop: 7, fontSize: 13, fontWeight: '700' },
  infoBox: { padding: 13, borderRadius: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line, marginBottom: 9 },
  label: { color: theme.muted, fontSize: 11, marginBottom: 4, fontWeight: '800' },
  value: { color: theme.text, fontSize: 14, fontWeight: '800', lineHeight: 21 },
  timeline: { gap: 8, marginTop: 4, marginBottom: 12 },
  timelineTitle: { color: theme.text, fontSize: 15, fontWeight: '900' },
  timelineRow: { color: theme.muted, fontSize: 12, fontWeight: '700' },
  primary: { minHeight: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd166' },
  primaryText: { color: '#141923', fontSize: 15, fontWeight: '900' },
  secondary: { minHeight: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceStrong, borderWidth: 1, borderColor: theme.line },
  secondaryText: { color: theme.text, fontSize: 15, fontWeight: '900' },
});
