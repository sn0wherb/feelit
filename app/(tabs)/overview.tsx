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
  const [logDataByDate, setLogDataByDate] = useState<FormattedLogDataType[]>();

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
    const currentDateISOString = currentDate.toISOString().slice(0, 10);

    let sortedIndex = 0;
    let sorted: FormattedLogDataType[] = [];

    data.map((value) => {
      let date = value.created_at.slice(0, 10);
      if (date === currentDateISOString) {
        // If date of log is equal to today, change to "Today"
        date = "Today";
      } else {
        // Else convert date to string
        let parts = date.split("-");
        let newDate = new Date(parts[0], parts[1] - 1, parts[2]);
        date = newDate.toDateString();
      }

      // We get a value
      // question - should the value be inserted in this index, or new one?
      // we check date compatibility by reading current index
      // oh what's that? current index doesn't exist? - that means initialize new index and insert date
      // so first we check if current index already exists.
      // if it does, we check the compatability. otherwise initialize new index creation

      // we want to initialize a new entry if 1) index doesn't contain one or 2) index does contain one, but date doesn't match
      // we do pure value insertion only when index contains entry and date matches

      // WORKING:
      // If empty index - initialize entry with date and empty log array
      if (!sorted[sortedIndex]) {
        sorted[sortedIndex] = { date: date, logs: [] };
        // Index contains entry. If date doesn't match we create and initialize a new entry
      } else if (sorted[sortedIndex].date !== date) {
        sortedIndex++;
        sorted[sortedIndex] = { date: date, logs: [] };
      }
      // Entry exists and date matches - insert here
      sorted[sortedIndex].logs.push(value);
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
      {/* <Text>Overview</Text> */}
      <View style={{ paddingHorizontal: 8 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sorted by date */}
          <FlatList
            contentContainerStyle={{ paddingBottom: 60, paddingTop: 10 }}
            data={logDataByDate}
            scrollEnabled={false}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 30,
                      padding: 10,
                      marginTop: 10,
                    }}
                  >
                    {item.date}
                  </Text>
                  {/* Individual logs */}
                  <FlatList
                    data={item.logs}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                      return (
                        // Card
                        <View
                          style={{
                            marginHorizontal: 10,
                            marginVertical: 8,
                            padding: 16,
                            backgroundColor: item.color,
                            borderRadius: 10,
                            // Shadow
                            shadowColor: item.color,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 6,
                          }}
                          key={item.id}
                        >
                          {/* Title & time */}
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: "bold",
                              }}
                            >
                              {item.emotion}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                              {formatDate(item["created_at"])}
                            </Text>
                          </View>

                          {/* Details */}
                          {item.root.length > 0 && (
                            <View style={{ marginTop: 20 }}>
                              <Text
                                style={[
                                  styles.emotionDetailTitle,
                                  {
                                    width: 50,
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                  },
                                ]}
                              >
                                Cause
                              </Text>
                              <Text
                                style={{
                                  marginBottom: 6,
                                  paddingHorizontal: 4,
                                }}
                              >
                                {item.root}
                              </Text>
                            </View>
                          )}
                          {item.need.length > 0 && (
                            <View style={{ marginTop: 8 }}>
                              <Text
                                style={[
                                  styles.emotionDetailTitle,
                                  {
                                    width: 44,
                                    backgroundColor: "rgba(0, 0, 0, 0.17)",
                                  },
                                ]}
                              >
                                Need
                              </Text>
                              <Text
                                style={{
                                  marginBottom: 6,
                                  paddingHorizontal: 4,
                                }}
                              >
                                {item.need}
                              </Text>
                            </View>
                          )}
                          {item.extra.length > 0 && (
                            <View style={{ marginTop: 8 }}>
                              <Text
                                style={[
                                  styles.emotionDetailTitle,
                                  {
                                    width: 42,
                                    backgroundColor: "rgba(0, 0, 0, 0.23)",
                                  },
                                ]}
                              >
                                Diary
                              </Text>
                              <Text
                                style={{
                                  marginBottom: 6,
                                  paddingHorizontal: 4,
                                }}
                              >
                                {item.extra}
                              </Text>
                            </View>
                          )}
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
  },
  emotionDetailTitle: {
    borderRadius: 30,
    marginBottom: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
