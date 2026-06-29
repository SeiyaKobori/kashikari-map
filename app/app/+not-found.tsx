import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/components/AppShell';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>画面が見つかりません</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>マップへ戻る</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.phone,
  },
  title: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '900',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#ffd166',
    fontWeight: '900',
  },
});
