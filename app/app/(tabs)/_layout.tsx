import { Tabs } from 'expo-router';
import { ColorValue, Text } from 'react-native';

import { theme } from '@/components/AppShell';

function TabIcon({ icon, color }: { icon: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 20, fontWeight: '900' }}>{icon}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: '#090e16',
          borderTopColor: 'rgba(255,255,255,0.10)',
          height: 74,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'マップ',
          tabBarIcon: ({ color }) => <TabIcon icon="◎" color={color} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: '一覧',
          tabBarIcon: ({ color }) => <TabIcon icon="≡" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'カレンダー',
          tabBarIcon: ({ color }) => <TabIcon icon="□" color={color} />,
        }}
      />
    </Tabs>
  );
}
