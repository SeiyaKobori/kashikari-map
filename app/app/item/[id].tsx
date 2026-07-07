import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { BorrowItem, directionActionLabel, directionColor, directionLabel, dueStatusLabel, formatDateLabel, normalizeOneCharacterIcon } from '@/constants/borrowItems';
import { useBorrowLedger } from '@/contexts/BorrowLedgerContext';

function MissingItem() {
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

function DetailContent({ item }: { item: BorrowItem }) {
  const { activeItems, completedItems, completeItem, updateItem, personOptions } = useBorrowLedger();
  const [isEditing, setIsEditing] = useState(false);
  const [person, setPerson] = useState(item.person);
  const [personIcon, setPersonIcon] = useState(item.personIcon);
  const [title, setTitle] = useState(item.title);
  const [memo, setMemo] = useState(item.memo);
  const isCompleted = Boolean(item.completedAt);
  const color = directionColor(item.direction);

  function handleComplete() {
    completeItem(item.id);
    router.replace({ pathname: '/(tabs)/list', params: { filter: 'completed' } });
  }

  function saveEdit() {
    updateItem(item.id, { person, personIcon, title, memo });
    setIsEditing(false);
  }

  function selectPerson(option: { person: string; personIcon: string }) {
    setPerson(option.person);
    setPersonIcon(normalizeOneCharacterIcon(option.personIcon) || '🙂');
  }

  return (
    <AppShell>
      <Stack.Screen options={{ title: '詳細' }} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ 戻る</Text>
        </Pressable>

        <View style={[styles.hero, { borderColor: `${color}66`, backgroundColor: item.direction === 'lend' ? 'rgba(255,122,69,0.18)' : 'rgba(69,199,255,0.18)' }]}>
          <Text style={styles.heroIcon}>{item.categoryIcon}</Text>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <Text style={styles.heroMeta}>{item.person} {item.direction === 'lend' ? 'へ貸出中' : 'から借りている'}</Text>
        </View>

        <View style={styles.editHeader}>
          <Text style={styles.editTitle}>人物・アイテム</Text>
          <Pressable onPress={() => setIsEditing((current) => !current)} style={styles.editToggle}>
            <Text style={styles.editToggleText}>{isEditing ? '閉じる' : '修正'}</Text>
          </Pressable>
        </View>

        {isEditing ? (
          <View style={styles.editBox}>
            {personOptions.length > 0 ? (
              <>
                <Text style={styles.label}>登録済みの人物から選ぶ</Text>
                <View style={styles.choiceRow}>
                  {personOptions.map((option) => (
                    <Pressable key={`${option.person}-${option.personIcon}`} onPress={() => selectPerson(option)} style={styles.personChoice}>
                      <Text style={styles.personChoiceIcon}>{option.personIcon}</Text>
                      <Text style={styles.personChoiceName}>{option.person}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}
            <TextInput value={person} onChangeText={setPerson} placeholder="相手の名前" placeholderTextColor={theme.muted} style={styles.input} />
            <TextInput value={personIcon} onChangeText={(value) => setPersonIcon(normalizeOneCharacterIcon(value))} placeholder="相手アイコン" placeholderTextColor={theme.muted} style={styles.input} />
            <TextInput value={title} onChangeText={setTitle} placeholder="品目・金額" placeholderTextColor={theme.muted} style={styles.input} />
            <TextInput value={memo} onChangeText={setMemo} placeholder="メモ" placeholderTextColor={theme.muted} style={[styles.input, styles.memo]} multiline />
            <Pressable onPress={saveEdit} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>修正を保存</Text>
            </Pressable>
          </View>
        ) : null}

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

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findItem } = useBorrowLedger();
  const item = id ? findItem(id) : undefined;

  if (!item) return <MissingItem />;
  return <DetailContent key={item.id} item={item} />;
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 10, paddingRight: 18 },
  backText: { color: theme.text, fontSize: 16, fontWeight: '900' },
  hero: { borderWidth: 1, borderRadius: 22, padding: 18, marginBottom: 10 },
  heroIcon: { fontSize: 28, marginBottom: 8 },
  heroTitle: { color: theme.text, fontSize: 24, fontWeight: '900' },
  heroMeta: { color: theme.muted, marginTop: 7, fontSize: 13, fontWeight: '700' },
  editHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9, marginTop: 3 },
  editTitle: { color: theme.text, fontSize: 15, fontWeight: '900' },
  editToggle: { borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: theme.surfaceStrong, borderWidth: 1, borderColor: theme.line },
  editToggleText: { color: theme.text, fontWeight: '900', fontSize: 12 },
  editBox: { borderRadius: 18, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surface, padding: 12, marginBottom: 10 },
  input: { minHeight: 50, padding: 13, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: theme.line, marginBottom: 9, color: theme.text, fontSize: 15, fontWeight: '800' },
  memo: { minHeight: 82, textAlignVertical: 'top' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  personChoice: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 9, backgroundColor: 'rgba(255,255,255,0.10)' },
  personChoiceIcon: { color: theme.text, fontSize: 16, fontWeight: '900' },
  personChoiceName: { color: theme.text, fontSize: 12, fontWeight: '900' },
  saveButton: { minHeight: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd166' },
  saveButtonText: { color: '#141923', fontWeight: '900' },
  infoBox: { padding: 13, borderRadius: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line, marginBottom: 9 },
  label: { color: theme.muted, fontSize: 11, marginBottom: 6, fontWeight: '800' },
  value: { color: theme.text, fontSize: 14, fontWeight: '800', lineHeight: 21 },
  timeline: { gap: 8, marginTop: 4, marginBottom: 12 },
  timelineTitle: { color: theme.text, fontSize: 15, fontWeight: '900' },
  timelineRow: { color: theme.muted, fontSize: 12, fontWeight: '700' },
  primary: { minHeight: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd166' },
  primaryText: { color: '#141923', fontSize: 15, fontWeight: '900' },
  secondary: { minHeight: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceStrong, borderWidth: 1, borderColor: theme.line },
  secondaryText: { color: theme.text, fontSize: 15, fontWeight: '900' },
});
