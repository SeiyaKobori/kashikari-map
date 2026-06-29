import { Href, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell, theme } from '@/components/AppShell';
import { BORROW_COLOR, LEND_COLOR, borrowItems, directionColor } from '@/constants/borrowItems';

function ConnectionLine({ from, to, color }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = `${Math.atan2(dy, dx)}rad`;

  return (
    <View
      style={[
        styles.line,
        {
          left: from.x,
          top: from.y,
          width: length,
          backgroundColor: color,
          transform: [{ rotateZ: angle }],
        },
      ]}
    />
  );
}

export default function MapScreen() {
  return (
    <AppShell>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ホーム</Text>
      </View>
      <View style={styles.mapStage}>
        <ScrollView horizontal bounces showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          <ScrollView bounces showsVerticalScrollIndicator={false} contentContainerStyle={styles.verticalScroll}>
            <View style={styles.canvas}>
              {borrowItems.map((item) => (
                <ConnectionLine
                  key={`line-${item.id}`}
                  color={directionColor(item.direction)}
                  from={{ x: 410, y: 460 }}
                  to={{ x: item.map.personLeft + 38, y: item.map.personTop + 38 }}
                />
              ))}

              <View style={styles.meNode}>
                <Text style={styles.meText}>自分</Text>
              </View>

              {borrowItems.map((item) => (
                <View key={`person-${item.id}`} style={[styles.personNode, { left: item.map.personLeft, top: item.map.personTop }]}>
                  <Text style={styles.personIcon}>{item.personIcon}</Text>
                  <Text style={styles.personName}>{item.person}</Text>
                </View>
              ))}

              {borrowItems.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  onPress={() => router.push(`/item/${item.id}` as Href)}
                  style={({ pressed }) => [
                    styles.itemTag,
                    {
                      left: item.map.itemLeft,
                      top: item.map.itemTop,
                      borderLeftColor: directionColor(item.direction),
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        <View style={styles.summary}>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>5</Text>
            <Text style={styles.metricLabel}>貸した</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>3</Text>
            <Text style={styles.metricLabel}>借りた</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>8</Text>
            <Text style={styles.metricLabel}>合計</Text>
          </View>
        </View>

        <View style={styles.legend}>
          <View style={[styles.legendLine, { backgroundColor: LEND_COLOR }]} />
          <Text style={styles.legendText}>貸した</Text>
          <View style={[styles.legendLine, { backgroundColor: BORROW_COLOR }]} />
          <Text style={styles.legendText}>借りた</Text>
        </View>

        <Pressable style={styles.fab} onPress={() => router.push('/item/new' as Href)}>
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  mapStage: {
    flex: 1,
    backgroundColor: '#0b111c',
    overflow: 'hidden',
  },
  horizontalScroll: {
    minHeight: 940,
  },
  verticalScroll: {
    width: 860,
    minHeight: 940,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  canvas: {
    width: 820,
    height: 900,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    height: 5,
    borderRadius: 999,
    transformOrigin: 'left center',
    opacity: 0.9,
  },
  meNode: {
    position: 'absolute',
    left: 366,
    top: 416,
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffd166',
  },
  meText: {
    color: '#141923',
    fontWeight: '900',
  },
  personNode: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  personIcon: {
    fontSize: 25,
  },
  personName: {
    color: theme.text,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 3,
  },
  itemTag: {
    position: 'absolute',
    minWidth: 138,
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
  },
  itemTitle: {
    color: '#111722',
    fontSize: 14,
    fontWeight: '900',
  },
  summary: {
    position: 'absolute',
    top: 8,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(9,14,22,0.72)',
    borderWidth: 1,
    borderColor: theme.line,
  },
  metric: {
    flex: 1,
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  metricNumber: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '900',
  },
  metricLabel: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  legend: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(9,14,22,0.76)',
    borderWidth: 1,
    borderColor: theme.line,
  },
  legendLine: {
    width: 18,
    height: 4,
    borderRadius: 999,
  },
  legendText: {
    color: theme.text,
    fontSize: 11,
    fontWeight: '900',
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 58,
    height: 58,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffd166',
  },
  fabText: {
    color: '#151515',
    fontSize: 30,
    fontWeight: '900',
  },
});
