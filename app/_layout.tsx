import { Stack } from "expo-router";
import { StatusBar, Platform } from "react-native";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function Layout() {
  const { queries } = require("../assets/SQL/queries.ts");

  const createTableIfNeeded = async (db: SQLiteDatabase) => {
    try {
      await db.execAsync(queries["createLogTable"]);
      // await db.execAsync(queries["createCustomEmotionsTable"]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SQLiteProvider databaseName="feelit.db" onInit={createTableIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar barStyle="dark-content" />
    </SQLiteProvider>
  );
}
