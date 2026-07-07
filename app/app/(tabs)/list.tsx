import { useLocalSearchParams, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { BorrowRow } from '@/components/BorrowRow';
import { useBorrowLedger } from '@/contexts/BorrowLedgerContext';

type ListMode = 'active' | 'completed';

export default function ListScreen() {
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const { activeItems, completedItems } = useBorrowLedger();
  const mode: ListMode = filter === 'completed' ? 'completed' : 'active';
  const visibleItems = mode === 'active' ? activeItems : completedItems;

  function selectMode(nextMode: ListMode) {
    router.setParams({ filter: nextMode === 'completed' ? 'completed' : undefined });
  }

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>一覧</Text>
        <View style={styles.segment}>
          <Pressable onPress={() => selectMode('active')} style={[styles.segmentButton, mode === 'active' && styles.segmentActive]}>
            <Text style={[styles.segmentText, mode === 'active' && styles.segmentActiveText]}>未完了 {activeItems.length}</Text>
          </Pressable>
          <Pressable onPress={() => selectMode('completed')} style={[styles.segmentButton, mode === 'completed' && styles.segmentActive]}>
            <Text style={[styles.segmentText, mode === 'completed' && styles.segmentActiveText]}>返却済み {completedItems.length}</Text>
          </Pressable>
        </View>
        <View style={styles.rows}>
          {visibleItems.length > 0 ? visibleItems.map((item) => (
            <BorrowRow key={item.id} item={item} completed={mode === 'completed'} />
          )) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>{mode === 'active' ? '未完了の貸し借りはありません' : '返却済みはまだありません'}</Text>
              {mode === 'active' ? (
                <Pressable onPress={() => router.push('/item/new')} style={styles.addButton}>
                  <Text style={styles.addButtonText}>貸し借りを追加</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 110 },
  title: { color: theme.text, fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  segment: { flexDirection: 'row', gap: 8, padding: 5, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: 10 },
  segmentButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12 },
  segmentActive: { backgroundColor: theme.text },
  segmentText: { color: theme.muted, fontWeight: '900' },
  segmentActiveText: { color: '#111722' },
  rows: { gap: 9 },
  empty: { alignItems: 'center', gap: 12, borderRadius: 22, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surface, padding: 24, marginTop: 6 },
  emptyTitle: { color: theme.text, fontWeight: '900' },
  addButton: { borderRadius: 999, backgroundColor: '#ffd166', paddingHorizontal: 16, paddingVertical: 10 },
  addButtonText: { color: '#141923', fontWeight: '900' },
});
