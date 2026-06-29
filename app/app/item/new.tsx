import { Stack, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';

export default function NewItemScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: '追加' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ 戻る</Text>
        </Pressable>
        <Text style={styles.title}>追加</Text>
        <View style={styles.segment}>
          <View style={styles.segmentActive}><Text style={styles.segmentActiveText}>貸した</Text></View>
          <View style={styles.segmentInactive}><Text style={styles.segmentInactiveText}>借りた</Text></View>
        </View>
        <View style={styles.input}><Text style={styles.label}>相手</Text><Text style={styles.value}>佐藤</Text></View>
        <View style={styles.input}><Text style={styles.label}>品目・金額</Text><Text style={styles.value}>ゼルダSwitch</Text></View>
        <View style={styles.input}><Text style={styles.label}>カテゴリ</Text><Text style={styles.value}>🎮 ゲーム</Text></View>
        <View style={styles.input}><Text style={styles.label}>返却予定</Text><Text style={styles.value}>今週中 / 日付指定 / 期限なし</Text></View>
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
  segmentActive: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: theme.text },
  segmentInactive: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12 },
  segmentActiveText: { color: '#111722', fontWeight: '900' },
  segmentInactiveText: { color: theme.muted, fontWeight: '900' },
  input: { padding: 13, borderRadius: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line, marginBottom: 9 },
  label: { color: theme.muted, fontSize: 11, marginBottom: 4, fontWeight: '800' },
  value: { color: theme.text, fontSize: 14, fontWeight: '800' },
  primary: { minHeight: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd166', marginTop: 4 },
  primaryText: { color: '#141923', fontWeight: '900', fontSize: 15 },
});
