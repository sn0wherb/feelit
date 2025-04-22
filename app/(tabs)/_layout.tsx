import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableHighlight, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 54,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderColor: "#555",
        },
        tabBarActiveTintColor: "#67804f",
        tabBarInactiveTintColor: "#344722",
        tabBarInactiveBackgroundColor: "beige",
        tabBarActiveBackgroundColor: "beige",
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          title: "All logs",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="access-time"
              size={32}
              color={color}
              style={{
                height: 30,
                marginTop: 10,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Recently",
          tabBarIcon: ({ color }) => (
            <FontAwesome6
              name="chart-simple"
              size={28}
              color={color}
              style={{ height: 28, marginTop: 10 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="logNewEmotionInit"
        listeners={{
          tabPress: (event) => {
            router.push("/logNewEmotion");
            event.preventDefault();
          },
        }}
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
                backgroundColor: "#e1be8e",
                marginBottom: 10,
              }}
            >
              <AntDesign name="plus" size={40} color={color} />
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
