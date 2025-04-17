import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Updates from "expo-updates";
import { useSQLiteContext } from "expo-sqlite";

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
      await db.execAsync("DROP TABLE user_created_emotions;");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView>
<<<<<<< HEAD
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
=======
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
      </View>
>>>>>>> 9f9ee28de9f3d860fcb80ba6258e4f446318ae9a
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
