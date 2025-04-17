import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

// type customEmotionType = {
//   emotion: string;
// };

const profiles = () => {
  const db = useSQLiteContext();

  // const [data, setData] = useState<customEmotionType[]>([]);

  // const getData = async () => {
  //   try {
  //     const data = await db.getAllAsync("SELECT * FROM user_created_emotions");
  //     setData(data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     getData();
  //   }, [])
  // );
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontSize: 50, color: "#6b5a2c" }}>Profiles</Text>
      </View>
    </SafeAreaView>
  );
};

export default profiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "beige",
    justifyContent: "center",
    alignItems: "center",
  },
});
