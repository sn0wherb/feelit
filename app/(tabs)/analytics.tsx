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
import Calendar from "@/components/Calendar";

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

type TimeFrameType = "Day" | "Week" | "Month" | "Year" | "All-time";

const { height, width } = Dimensions.get("window");

const analytics = () => {
  const [logData, setLogData] = useState<LogType[]>([]);
  const [logDataByDate, setLogDataByDate] = useState<FormattedLogDataType[]>();
  const [mostFrequentEmotions, setMostFrequentEmotions] = useState<
    {
      emotion: string;
      logCountByEmotion: number;
      color: string;
      created_at: string;
    }[]
  >([]);
  const [selectedTimeFrameIndex, setSelectedTimeFrameIndex] =
    useState<TimeFrameType>("Day");

  const db = useSQLiteContext();
  const timeFrames: TimeFrameType[] = [
    "Day",
    "Week",
    "Month",
    "Year",
    "All-time",
  ];

  // Functions
  const getLogs = async () => {
    try {
      const data = await db.getAllAsync<LogType>(
        "SELECT * FROM emotion_logs ORDER BY created_at DESC"
      );
      setLogData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getMostFrequentEmotions = async (timeFrame: TimeFrameType) => {
    let timeFrameSQL: string = "";
    const today = new Date();
    switch (timeFrame) {
      case "Day":
        timeFrameSQL = `created_at LIKE '${today.toISOString().slice(0, 10)}%'`;
        break;
      case "Week":
        // Get number of current day
        const currentDayNumber = today.getDay();
        // Subtract current day's number from current day's date - 1 to get first day of week. - 2 in order to get Monday, because JS Date object has Sunday set as first day of week
        const mondayOfThisWeek = new Date();
        mondayOfThisWeek.setDate(today.getDate() - (currentDayNumber - 2));
        // Create SQL query beginning
        const weekDay = new Date();
        timeFrameSQL = "created_at LIKE ";
        // Compose SQL query with each day in this week up to current day
        for (let i = 0; i < currentDayNumber; i++) {
          if (i != currentDayNumber - 1) {
            weekDay.setDate(mondayOfThisWeek.getDate() + i);
            timeFrameSQL += `'${weekDay
              .toISOString()
              .slice(0, 10)}%' OR created_at LIKE `;
          } else {
            weekDay.setDate(mondayOfThisWeek.getDate() + i);
            timeFrameSQL += `'${weekDay.toISOString().slice(0, 10)}%'`;
          }
        }
        break;
      case "Month":
        timeFrameSQL = `created_at LIKE '${today.toISOString().slice(0, 7)}%'`;
        break;
      case "Year":
        timeFrameSQL = `created_at LIKE '${today.toISOString().slice(0, 4)}%'`;
        break;
      default:
        timeFrameSQL = `created_at LIKE '%'`;
        break;
    }
    try {
      const data = await db.getAllAsync<{
        emotion: string;
        logCountByEmotion: number;
        color: string;
        created_at: string;
      }>(
        `SELECT 
        emotion,
        COUNT(emotion) AS logCountByEmotion,
        color,
        created_at
        FROM emotion_logs
        WHERE ${timeFrameSQL}
        GROUP BY emotion
        ORDER BY logCountByEmotion DESC
        LIMIT 3`
      );
      setMostFrequentEmotions(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getMostFrequentEmotions(selectedTimeFrameIndex);
  }, [selectedTimeFrameIndex]);

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
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 14,
            }}
          >
            My top emotions
          </Text>
          {/* Timeframes */}
          <View style={{ paddingBottom: 20 }}>
            <FlatList
              contentContainerStyle={{ gap: 10 }}
              scrollEnabled={false}
              horizontal={true}
              data={timeFrames}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.timeFrameSelectButton}
                    onPress={() => {
                      setSelectedTimeFrameIndex(item);
                    }}
                  >
                    <Text
                      style={[
                        styles.timeFrameButtonText,
                        {
                          color:
                            item == selectedTimeFrameIndex ? "#000" : "#777",
                          textDecorationLine:
                            item == selectedTimeFrameIndex
                              ? "underline"
                              : "none",
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          {/* Emotions in selected timeframe */}
          <View>
            {mostFrequentEmotions.length > 0 ? (
              // Emotions in this timeframe exist
              <FlatList
                scrollEnabled={false}
                data={mostFrequentEmotions}
                renderItem={({ item, index }) => {
                  let size, color, spotColor;
                  switch (index) {
                    case 0:
                      color = "gold";
                      size = 40;
                      break;
                    case 1:
                      color = "silver";
                      size = 34;
                      break;
                    case 2:
                      color = "#CD7F32";
                      size = 28;
                      break;
                    default:
                      color = "";
                      size = 20;
                      break;
                  }
                  const spotStyle = StyleSheet.create({
                    spot: {
                      fontSize: size,
                      fontWeight: "bold",
                      color: color,
                      textAlign: "center",
                    },
                  });

                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: width * 0.04,
                      }}
                    >
                      <TouchableOpacity onPress={() => {}}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingLeft: 12,
                            paddingRight: 14,
                            paddingVertical: 10,
                            backgroundColor: item.color,
                            marginVertical: 6,
                            borderRadius: 10,
                            // TO-DO: make exponential
                            width: width * (0.56 + (3 - index) / 20),
                          }}
                        >
                          <View
                            style={{
                              width: width * 0.08,
                              justifyContent: "center",
                            }}
                          >
                            <Text style={spotStyle.spot}>{index + 1}</Text>
                          </View>
                          <Text style={{ fontSize: 24 }}>{item.emotion}</Text>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          justifyContent: "center",
                          width: width * 0.08,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: size,
                            fontWeight: "bold",
                            color: item.color,
                            textAlign: "center",
                          }}
                        >
                          {item.logCountByEmotion}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            ) : (
              // No emotions in this timeframe
              <View>
                <Text style={styles.noEmotionsInThisTimeframe}>
                  You haven't added any emotions{" "}
                  {selectedTimeFrameIndex == "Day"
                    ? "today."
                    : "this " + uncapitalise(selectedTimeFrameIndex) + "."}
                </Text>
              </View>
            )}
          </View>
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
  timeFrameSelectButton: {},
  timeFrameButtonText: {
    // textDecorationLine: "underline",
    fontSize: 20,
  },
  noEmotionsInThisTimeframe: {
    color: "#444",
    fontSize: 20,
  },
});
