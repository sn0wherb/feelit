import { Button, StyleSheet, Text, View } from "react-native";
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
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 200,
          marginHorizontal: 30,
          backgroundColor: "green",
          borderRadius: 10,
        }}
      >
        <Button
          onPress={Updates.reloadAsync}
          title="Reload app"
          color="white"
        />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 200,
          marginHorizontal: 30,
          backgroundColor: "blue",
          borderRadius: 10,
        }}
      >
        <Button onPress={dropLogs} title="Clear log table" color="white" />
      </View>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({});
