import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 54,
          borderTopWidth: 0,
          borderColor: "#555",
          paddingBottom: 0,
        },
        tabBarActiveTintColor: "#7f9b66",
        tabBarInactiveTintColor: "#344722",
        tabBarInactiveBackgroundColor: "#e3d7b7",
        tabBarActiveBackgroundColor: "#e3d7b7",
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          title: "All logs",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="calendar-o"
              size={28}
              color={color}
              style={{ height: 28, marginTop: 10 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recently"
        options={{
          title: "Recently",
          tabBarIcon: ({ color }) => (
            <Feather
              name="rewind"
              size={28}
              color={color}
              style={{ height: 28, marginTop: 10 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "New Entry",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 64,
                width: 64,
                borderRadius: 50,
                backgroundColor: "#d1be8e",
                marginBottom: 10,
              }}
            >
              {/* <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 60,
                  width: 60,
                  borderRadius: 50,
                  backgroundColor: "#eee4ca",
                  marginBottom: 10,
                }}
              > */}
              <AntDesign name="plus" size={40} color={color} />
              {/* </View> */}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: "Profiles",
          tabBarIcon: ({ color }) => (
            <FontAwesome6
              name="person"
              size={28}
              style={{ height: 28, marginTop: 10 }}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="setting"
              size={28}
              style={{ height: 28, marginTop: 10 }}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
