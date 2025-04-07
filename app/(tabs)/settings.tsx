import {
  Button,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Updates from "expo-updates";
import { useSQLiteContext } from "expo-sqlite";

const settings = () => {
  const db = useSQLiteContext();

  const dropLogs = async () => {
    try {
      await db.execAsync("DROP TABLE emotion_logs;");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView>
      <TouchableHighlight
        style={[styles.button, { backgroundColor: "green" }]}
        onPress={Updates.reloadAsync}
      >
        <Text>Reload app</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[styles.button, { backgroundColor: "blue" }]}
        onPress={dropLogs}
      >
        <Text>Drop log table</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    marginTop: 200,
    marginHorizontal: 30,
    borderRadius: 10,
    fontSize: 24,
  },
});
