import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { COLORS } from "@/theme/colors";
import SyncButton from "@/components/syncButton";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.background,
        tabBarInactiveTintColor: COLORS.text,
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerShadowVisible: false,
        headerTintColor: COLORS.background,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
        },
        headerRight: () => <SyncButton />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Clothes",
          tabBarIcon: ({ color }) => (
            <AntDesign name="skin" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="outfit"
        options={{
          title: "My Outfits",
          tabBarIcon: ({ color }) => (
            <AntDesign name="database" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
