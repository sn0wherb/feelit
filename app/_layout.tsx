import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function Layout() {
  // const { queries } = require("../assets/SQL/queries.ts");

  // const createTableIfNeeded = async (db: SQLiteDatabase) => {
  //   try {
  //     await db.execAsync(queries["createAndPopulateEmotions"]);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
