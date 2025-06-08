import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { FlatList } from "react-native";
import { uncapitalise } from "@/assets/functions";
import Calendar from "@/components/Calendar/Calendar";
import MostFrequentEmotions from "@/components/Analytics/MostFrequentEmotions";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

type FormattedLogDataType = {
  date: string;
  logs: LogType[];
};

const { height, width } = Dimensions.get("window");

const analytics = () => {
  const [logData, setLogData] = useState<LogType[]>([]);
  const [logDataByDate, setLogDataByDate] = useState<FormattedLogDataType[]>();

  // Functions
  // const getLogs = async () => {
  //   try {
  //     const data = await db.getAllAsync<LogType>(
  //       "SELECT * FROM emotion_logs ORDER BY created_at DESC"
  //     );
  //     setLogData(data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        {/* Calendar */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Calendar />
        </View>
        {/* Top Emotions */}
        <View style={{ padding: 20 }}>
          <MostFrequentEmotions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default analytics;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "beige",
  },
});
