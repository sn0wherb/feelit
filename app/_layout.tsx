import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "react-native";

export default function Layout() {
  const { queries } = require("../assets/SQL/queries.ts");

  const createTableIfNeeded = async (db: SQLiteDatabase) => {
    try {
      await db.execAsync(queries["createLogTable"]);
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
