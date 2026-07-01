import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { BORROW_COLOR, LEND_COLOR, BorrowDirection } from '@/constants/borrowItems';

export default function NewItemScreen() {
  const [direction, setDirection] = useState<BorrowDirection>('lend');
  const isLend = direction === 'lend';
  const accentColor = isLend ? LEND_COLOR : BORROW_COLOR;

  return (
    <AppShell>
      <Stack.Screen options={{ title: '追加' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ 戻る</Text>
        </Pressable>
        <Text style={styles.title}>追加</Text>
        <View style={styles.segment}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isLend }}
            onPress={() => setDirection('lend')}
            style={[styles.segmentButton, isLend && { backgroundColor: accentColor }]}>
            <Text style={[styles.segmentText, isLend && styles.segmentActiveText]}>貸した</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: !isLend }}
            onPress={() => setDirection('borrow')}
            style={[styles.segmentButton, !isLend && { backgroundColor: accentColor }]}>
            <Text style={[styles.segmentText, !isLend && styles.segmentActiveText]}>借りた</Text>
          </Pressable>
        </View>
        <View style={[styles.selectedHint, { borderColor: `${accentColor}66`, backgroundColor: `${accentColor}22` }]}>
          <Text style={styles.selectedHintText}>{isLend ? '貸したものとして登録' : '借りたものとして登録'}</Text>
        </View>
        <View style={styles.input}><Text style={styles.label}>相手</Text><Text style={styles.value}>{isLend ? '佐藤' : '山田'}</Text></View>
        <View style={styles.input}><Text style={styles.label}>品目・金額</Text><Text style={styles.value}>{isLend ? 'ゼルダSwitch' : '¥4,500'}</Text></View>
        <View style={styles.input}><Text style={styles.label}>カテゴリ</Text><Text style={styles.value}>{isLend ? '🎮 ゲーム' : '¥ お金'}</Text></View>
        <View style={styles.input}><Text style={styles.label}>{isLend ? '返却予定' : '返済・返却予定'}</Text><Text style={styles.value}>今週中 / 日付指定 / 期限なし</Text></View>
        <Pressable onPress={() => router.replace('/')} style={styles.primary}>
          <Text style={styles.primaryText}>マップへ追加する</Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 10, paddingRight: 18 },
  backText: { color: theme.text, fontSize: 16, fontWeight: '900' },
  title: { color: theme.text, fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  segment: { flexDirection: 'row', gap: 8, padding: 5, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: 10 },
  segmentButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12 },
  segmentText: { color: theme.muted, fontWeight: '900' },
  segmentActiveText: { color: '#111722' },
  selectedHint: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 10 },
  selectedHintText: { color: theme.text, fontWeight: '900', textAlign: 'center' },
  input: { padding: 13, borderRadius: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line, marginBottom: 9 },
  label: { color: theme.muted, fontSize: 11, marginBottom: 4, fontWeight: '800' },
  value: { color: theme.text, fontSize: 14, fontWeight: '800' },
  primary: { minHeight: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd166', marginTop: 4 },
  primaryText: { color: '#141923', fontWeight: '900', fontSize: 15 },
});
