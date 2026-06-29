import { Stack, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { BorrowRow } from '@/components/BorrowRow';
import { completedItems } from '@/constants/borrowItems';

export default function HistoryScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: '返却済み' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ 一覧へ戻る</Text>
        </Pressable>
        <Text style={styles.title}>返却済み</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>完了した貸し借り</Text>
          <Text style={styles.cardText}>一覧メニューの「返却済み」から確認する履歴です。</Text>
        </View>
        <View style={styles.rows}>
          {completedItems.map((item) => (
            <BorrowRow key={item.id} item={item} showDue compact />
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 18,
  },
  backText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '900',
  },
  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    marginBottom: 12,
  },
  cardTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '900',
  },
  cardText: {
    color: theme.muted,
    marginTop: 8,
    fontWeight: '700',
    lineHeight: 20,
  },
  rows: {
    gap: 9,
  },
});
