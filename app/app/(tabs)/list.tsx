import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { BorrowRow } from '@/components/BorrowRow';
import { borrowItems } from '@/constants/borrowItems';

export default function ListScreen() {
  const [mode, setMode] = useState<'active' | 'completed'>('active');

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>一覧</Text>
        <View style={styles.segment}>
          <Pressable onPress={() => setMode('active')} style={[styles.segmentButton, mode === 'active' && styles.segmentActive]}>
            <Text style={[styles.segmentText, mode === 'active' && styles.segmentActiveText]}>未完了</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/history')} style={styles.segmentButton}>
            <Text style={styles.segmentText}>返却済み</Text>
          </Pressable>
        </View>

        <View style={styles.rows}>
          {borrowItems.slice(0, 4).map((item) => (
            <BorrowRow key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
  },
  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
    padding: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginBottom: 10,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: theme.text,
  },
  segmentText: {
    color: theme.muted,
    fontWeight: '900',
  },
  segmentActiveText: {
    color: '#111722',
  },
  rows: {
    gap: 9,
  },
});
