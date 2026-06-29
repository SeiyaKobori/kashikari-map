import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.phone}>{children}</View>
    </SafeAreaView>
  );
}

export const theme = {
  bg: '#050914',
  phone: '#0d1420',
  text: '#f6f1e8',
  muted: '#aeb7c7',
  surface: 'rgba(255,255,255,0.075)',
  surfaceStrong: 'rgba(255,255,255,0.12)',
  line: 'rgba(255,255,255,0.12)',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  phone: {
    flex: 1,
    backgroundColor: theme.phone,
  },
});
