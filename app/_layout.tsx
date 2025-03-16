import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function Layout() {
  const createTableIfNeeded = async (db: SQLiteDatabase) => {
    try {
      await db.execAsync(`
            CREATE TABLE IF NOT EXISTS emotions (id INTEGER PRIMARY KEY, name TEXT UNIQUE, level INTEGER, parent TEXT);
            INSERT OR IGNORE INTO emotions (id, name, level, parent) VALUES (0, 'Happy', 1, NULL);    
            INSERT OR IGNORE INTO emotions (id, name, level, parent) VALUES (1, 'Sad', 1, NULL);    
            INSERT OR IGNORE INTO emotions (id, name, level, parent) VALUES (2, 'Angry', 1, NULL);    
            INSERT OR IGNORE INTO emotions (id, name, level, parent) VALUES (3, 'Surprised', 1, NULL);    
            INSERT OR IGNORE INTO emotions (id, name, level, parent) VALUES (4, 'Scared', 1, NULL);    
            INSERT OR IGNORE INTO emotions (id, name, level, parent) VALUES (5, 'Disgusted', 1, NULL);
    `);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <SQLiteProvider databaseName="feelit.db" onInit={createTableIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
