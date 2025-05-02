import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
} from "react-native";
import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Updates from "expo-updates";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import PagerView from "react-native-pager-view";

const { width, height } = Dimensions.get("window");

const settings = () => {
  const db = useSQLiteContext();

  const dropLogs = async () => {
    try {
      await db.execAsync("DROP TABLE emotion_logs;");
    } catch (e) {
      console.error(e);
    }
  };

  const dropCustomEmotions = async () => {
    try {
      await db.execAsync(`
        ALTER TABLE user_created_emotions
        ADD COLUMN isCustom INTEGER DEFAULT 1
        `);
    } catch (e) {
      console.error(e);
    }
  };

  const testFunction = () => {
    console.log("date: ", new Date(Date.UTC(2025, 0, 1)));
  };

  useFocusEffect(
    useCallback(() => {
      // testFunction();
    }, [])
  );

  const testData = [0, 1, 2, 3, 4, 5, 6];

  return (
    <SafeAreaView>
      <View style={styles.container}>
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
        <TouchableHighlight
          style={[styles.button, { backgroundColor: "dodgerblue" }]}
          onPress={dropCustomEmotions}
        >
          <Text>Drop custom emotions table</Text>
        </TouchableHighlight>
        <FlatList
          data={testData}
          horizontal
          pagingEnabled
          initialScrollIndex={8}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => {
            return (
              <View style={{ width: width }}>
                <Text>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: "beige",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    marginTop: 20,
    marginHorizontal: 30,
    borderRadius: 10,
    fontSize: 24,
  },
});
