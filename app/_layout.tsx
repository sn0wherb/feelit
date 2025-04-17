import { Stack } from "expo-router";
import { StatusBar, Platform } from "react-native";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function Layout() {
  const { queries } = require("../assets/SQL/queries.ts");

  const createTablesIfNeeded = async (db: SQLiteDatabase) => {
    try {
      await db.execAsync(queries["createLogTable"]);
      await db.execAsync(queries["createCustomEmotionsTable"]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SQLiteProvider databaseName="feelit.db" onInit={createTablesIfNeeded}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
        <Stack.Screen
          name="logNewEmotion"
          options={{
            animation: "fade_from_bottom",
            gestureEnabled: false,
            // gestureDirection: "vertical",
          }}
        />
        <Stack.Screen
          name="logModal"
          // options={{
          //   presentation: "transparentModal",
          //   // animationDuration: 1000000,
          // }}
        />
      </Stack>
      <StatusBar barStyle="dark-content" />
    </SQLiteProvider>
  );
}
