import { Tabs } from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
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
