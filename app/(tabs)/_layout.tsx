import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 54,
          borderTopWidth: 0.3,
          borderColor: "#555",
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "New Entry",
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="plus"
              size={28}
              style={{ height: 28, marginTop: 10 }}
              color="black"
            />
          ),
        }}
      />
    </Tabs>
  );
}
