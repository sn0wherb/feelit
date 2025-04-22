import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { FlatList } from "react-native";

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
  const [mostFrequentEmotions, setMostFrequentEmotions] = useState<
    { emotion: string; logCountByEmotion: number; color: string }[]
  >([]);
  const [selectedTimeFrameIndex, setSelectedTimeFrameIndex] = useState(1);

  const db = useSQLiteContext();
  const timeFrames = ["Day", "Week", "Month", "Year", "All-time"];

  // Functions
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
    const today = new Date();

    let sortedIndex = 0;
    let sortedData: FormattedLogDataType[] = [];

    // Check if date of current log is in the margins of this week
    const isInWeek = (date: Date) => {
      // Reduce day difference between the given date and today's date
      for (let i = 6; i >= 0; i--) {
        const givenDate = new Date(date);
        givenDate.setDate(date.getDate() + i);

        if (String(givenDate).slice(0, 10) == String(today).slice(0, 10)) {
          if (i > 1) {
            return date.toLocaleDateString("default", { weekday: "long" });
          } else if (i == 1) {
            return "Yesterday";
          }
          return "Today";
        }
      }
      return false;
    };

    // Iterate through each log
    data.map((value) => {
      let date = "";
      let dateFormat = new Date(value.created_at);
      const yearString = String(dateFormat.getFullYear());
      const currentYearString = String(today.getFullYear());
      const isItCurrentYear = yearString == currentYearString ? true : false;
      const monthString = String(
        dateFormat.toLocaleDateString("default", { month: "long" })
      );
      const currentMonth = String(
        today.toLocaleDateString("default", { month: "long" })
      );
      const isItCurrentMoth = monthString == currentMonth ? true : false;

      // If log is of this year and month, check if it's in this week, else don't bother lol
      const inWeek =
        isItCurrentYear && isItCurrentMoth ? isInWeek(dateFormat) : false;

      // FORMAT DATE
      if (inWeek) {
        date = inWeek;
      } else {
        const dayString = String(
            dateFormat.toLocaleDateString("default", { weekday: "long" })
          ),
          dateString = String(dateFormat.getDate());

        // If year == current year, display weekday name, but not year. Otherwise, don't display weekday name, but display year.
        date = isItCurrentYear
          ? `${dayString}, ${dateString} ${monthString}`
          : `${dateString} ${monthString} ${yearString}`;
      }

      // INSERT LOG
      // Empty index - initialize entry on current index
      if (!sortedData[sortedIndex]) {
        sortedData[sortedIndex] = { date: date, logs: [] };
        // Index contains entry, but date doesn't match - move to next index and initialize a new entry
      } else if (sortedData[sortedIndex].date !== date) {
        sortedIndex++;
        sortedData[sortedIndex] = { date: date, logs: [] };
      }
      // Entry exists and date matches - insert here
      sortedData[sortedIndex].logs.push(value);
    });
    setLogDataByDate(sortedData);
  };

  const getMostFrequentEmotions = async () => {
    try {
      const data = await db.getAllAsync<{
        emotion: string;
        logCountByEmotion: number;
        color: string;
      }>(
        `SELECT 
        emotion,
        COUNT(emotion) AS logCountByEmotion,
        color 
        FROM emotion_logs 
        GROUP BY emotion
        ORDER BY logCountByEmotion DESC
        LIMIT 3`
      );
      setMostFrequentEmotions(data);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getLogs();
      getMostFrequentEmotions();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        <FlatList
          contentContainerStyle={{ gap: 10 }}
          scrollEnabled={false}
          horizontal={true}
          data={timeFrames}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.timeFrameSelectButton}
                onPress={() => {
                  setSelectedTimeFrameIndex(index);
                }}
              >
                <Text
                  style={[
                    styles.timeFrameButtonText,
                    {
                      color: index == selectedTimeFrameIndex ? "#000" : "#777",
                      textDecorationLine:
                        index == selectedTimeFrameIndex ? "underline" : "none",
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
      <ScrollView>
        {/* Top Emotions */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            My top emotions
          </Text>
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
});
