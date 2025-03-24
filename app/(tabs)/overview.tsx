import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";

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

const overview = () => {
  const [logData, setLogData] = useState<LogType[]>([]);
  const [logDataByDate, setLogDataByDate] =
    useState<[[string | null, LogType[]]]>();

  const db = useSQLiteContext();

  const getLogs = async () => {
    try {
      const data = await db.getAllAsync<LogType>(
        "SELECT * FROM emotion_logs ORDER BY created_at DESC"
      );
      setLogData(data);
      sortLogDataByDate(data);
    } catch (e) {
      console.error(e);
    }
  };

  const sortLogDataByDate = (data: LogType[]) => {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);

    let sortedIndex = 0;
    let sorted: [[string | null, LogType[]]] = [["test", []]];

    data.map((value) => {
      let date = value.created_at.slice(0, 10);
      if (date === currentDateString) {
        // If date of log is equal to today, change to "Today", else display date as is
        date = "Today";
      }

      if (sorted[sortedIndex][0] === date) {
        // If date entry exists and matches current log, add to log array on this date
        sorted[sortedIndex][1].push(value);
      } else {
        // If date entry doesn't exist or doesn't match, create a new date entry and add to it this log
        sorted.push([date, [value]]);
        sortedIndex++;
      }
    });
    setLogDataByDate(sorted);
  };

  const formatDate = (dateTime: string) => {
    // console.log(dateTime);
    const time = dateTime.slice(11, 16);

    return <Text>{time}</Text>;
  };

  // Re-fetch log data whenever tab is focused
  useFocusEffect(
    useCallback(() => {
      getLogs();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, width: "100%", paddingHorizontal: 10 }}>
        <ScrollView>
          <FlatList
            data={logDataByDate}
            scrollEnabled={false}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text
                    style={{ fontWeight: "bold", fontSize: 24, padding: 6 }}
                  >
                    {item[0]}
                  </Text>
                  <FlatList
                    style={{}}
                    data={item[1]}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                      return (
                        <View
                          style={{
                            marginHorizontal: 10,
                            marginVertical: 8,
                            padding: 10,
                            backgroundColor: item.color,
                            borderRadius: 10,
                          }}
                          key={item.id}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              marginBottom: 4,
                            }}
                          >
                            {item.emotion}
                          </Text>
                          <Text>Root: {item.root}</Text>
                          <Text>Need: {item.need}</Text>
                          <Text>{formatDate(item["created_at"])}</Text>
                        </View>
                      );
                    }}
                  />
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default overview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "beige",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
