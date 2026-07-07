import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { BORROW_COLOR, BorrowDirection, LEND_COLOR } from '@/constants/borrowItems';
import { useBorrowLedger } from '@/contexts/BorrowLedgerContext';

const categoryChoices = [
  { icon: '¥', label: 'お金' },
  { icon: '🎮', label: 'ゲーム' },
  { icon: '📘', label: '本' },
  { icon: '🔌', label: 'ガジェット' },
  { icon: '📦', label: 'その他' },
];

const reminderChoices = [0, 1, 2, 3, 7];

export default function NewItemScreen() {
  const { addItem } = useBorrowLedger();
  const [direction, setDirection] = useState<BorrowDirection>('lend');
  const [person, setPerson] = useState('');
  const [personIcon, setPersonIcon] = useState('🙂');
  const [title, setTitle] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('📦');
  const [dueDate, setDueDate] = useState('2026-07-14');
  const [reminderDays, setReminderDays] = useState(1);
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const isLend = direction === 'lend';
  const accentColor = isLend ? LEND_COLOR : BORROW_COLOR;

  function submit() {
    if (!person.trim() || !title.trim()) {
      setError('相手と品目・金額を入力してください');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) {
      setError('日付は YYYY-MM-DD 形式で入力してください');
      return;
    }
    const item = addItem({
      title,
      person,
      personIcon,
      direction,
      categoryIcon,
      dueDate,
      reminderDays,
      memo,
    });
    router.replace(`/item/${item.id}`);
  }

  return (
    <AppShell>
      <Stack.Screen options={{ title: '追加' }} />
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹ 戻る</Text>
          </Pressable>
          <Text style={styles.title}>貸し借りを追加</Text>
          <View style={styles.segment}>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: isLend }} onPress={() => setDirection('lend')} style={[styles.segmentButton, isLend && { backgroundColor: accentColor }]}>
              <Text style={[styles.segmentText, isLend && styles.segmentActiveText]}>貸した</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: !isLend }} onPress={() => setDirection('borrow')} style={[styles.segmentButton, !isLend && { backgroundColor: accentColor }]}>
              <Text style={[styles.segmentText, !isLend && styles.segmentActiveText]}>借りた</Text>
            </Pressable>
          </View>

          <View style={[styles.selectedHint, { borderColor: `${accentColor}66`, backgroundColor: `${accentColor}22` }]}>
            <Text style={styles.selectedHintText}>{isLend ? '自分から相手へ貸しているものを登録' : '相手から自分が借りているものを登録'}</Text>
          </View>

          <TextInput value={person} onChangeText={setPerson} placeholder="相手の名前" placeholderTextColor={theme.muted} style={styles.input} />
          <TextInput value={personIcon} onChangeText={setPersonIcon} placeholder="相手アイコン 例: 🙂" placeholderTextColor={theme.muted} style={styles.input} maxLength={4} />
          <TextInput value={title} onChangeText={setTitle} placeholder="品目・金額 例: ¥4,500 / Switchソフト" placeholderTextColor={theme.muted} style={styles.input} />

          <Text style={styles.label}>カテゴリ</Text>
          <View style={styles.choiceRow}>
            {categoryChoices.map((choice) => (
              <Pressable key={choice.icon} onPress={() => setCategoryIcon(choice.icon)} style={[styles.choice, categoryIcon === choice.icon && { backgroundColor: accentColor }]}>
                <Text style={[styles.choiceText, categoryIcon === choice.icon && styles.choiceActiveText]}>{choice.icon} {choice.label}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput value={dueDate} onChangeText={setDueDate} placeholder="返却・返済予定日 YYYY-MM-DD" placeholderTextColor={theme.muted} style={styles.input} keyboardType="numbers-and-punctuation" />

          <Text style={styles.label}>リマインダー</Text>
          <View style={styles.choiceRow}>
            {reminderChoices.map((days) => (
              <Pressable key={days} onPress={() => setReminderDays(days)} style={[styles.choice, reminderDays === days && { backgroundColor: accentColor }]}>
                <Text style={[styles.choiceText, reminderDays === days && styles.choiceActiveText]}>{days === 0 ? '当日' : `${days}日前`}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput value={memo} onChangeText={setMemo} placeholder="メモ 例: 箱付き、次会う時に返す" placeholderTextColor={theme.muted} style={[styles.input, styles.memo]} multiline />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={submit} style={[styles.primary, { backgroundColor: accentColor }]}>
            <Text style={styles.primaryText}>マップへ追加する</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
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
  input: { minHeight: 50, padding: 13, borderRadius: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line, marginBottom: 9, color: theme.text, fontSize: 15, fontWeight: '800' },
  memo: { minHeight: 88, textAlignVertical: 'top' },
  label: { color: theme.muted, fontSize: 12, marginTop: 4, marginBottom: 8, fontWeight: '900' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  choice: { borderRadius: 999, paddingHorizontal: 11, paddingVertical: 9, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line },
  choiceText: { color: theme.text, fontWeight: '900', fontSize: 12 },
  choiceActiveText: { color: '#111722' },
  error: { color: '#ff8fa3', fontWeight: '900', marginBottom: 10, textAlign: 'center' },
  primary: { minHeight: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryText: { color: '#141923', fontWeight: '900', fontSize: 15 },
});
