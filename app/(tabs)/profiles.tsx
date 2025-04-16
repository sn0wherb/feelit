import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

type customEmotionType = {
  emotion: string;
  parent: string | null | undefined;
  color: string;
};

const profiles = () => {
  const db = useSQLiteContext();

  const [data, setData] = useState<customEmotionType[]>([]);

  const getData = async () => {
    try {
      const data = await db.getAllAsync<customEmotionType>(
        "SELECT * FROM user_created_emotions"
      );
      console.log(data);
      setData(data);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontSize: 50, color: "#6b5a2c" }}>profiles</Text>
      </View>
    </SafeAreaView>
  );
};

export default profiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 18,
    borderColor: "#b4a271",
  },
});
