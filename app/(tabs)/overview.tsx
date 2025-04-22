import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import logModal from "../logModal";

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

const overview = () => {
  const [logData, setLogData] = useState<LogType[]>([]);
  const [logDataByDate, setLogDataByDate] = useState<FormattedLogDataType[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<LogType>();

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

  const getLocalTime = (dateTime: string) => {
    const gmtTime = new Date(dateTime);
    const localTimeZoneOffset = new Date().getTimezoneOffset();
    gmtTime.setMinutes(gmtTime.getMinutes() - localTimeZoneOffset);
    const time = gmtTime.toLocaleTimeString().slice(0, 5);

    return time;
  };

  const openLogModal = (log: LogType, date: string, time: string) => {
    const params = Object.assign(log);
    params["date"] = date;
    params["time"] = time;
    router.push({
      pathname: "/logModal",
      params: params,
    });
  };

  // Re-fetch log data whenever tab is focused
  useFocusEffect(
    useCallback(() => {
      getLogs();
    }, [])
  );

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* If there are no logs yet */}
      {logData.length == 0 && (
        <View
          style={{
            height: height,
            width: width,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              marginBottom: 60,
              marginHorizontal: 32,
              fontSize: 30,
              textAlign: "center",
            }}
          >
            Your emotions will appear here!
          </Text>
          <Text
            style={{
              marginBottom: 30,
              marginHorizontal: 40,
              fontSize: 26,
              textAlign: "center",
            }}
          >
            Click on '+' to add your first emotion
          </Text>
        </View>
      )}
      {/* <Text>Overview</Text> */}
      <View style={{ paddingHorizontal: 8, height: height, width: width }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sorted by date */}
          <FlatList
            contentContainerStyle={{ paddingBottom: 140, paddingTop: 10 }}
            data={logDataByDate}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              const logCollection = item;
              const getFontSize = () => {
                if (index == 0) {
                  return 40;
                } else if (index == 1) {
                  return 34;
                }
                return 30;
              };
              return (
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: getFontSize(),
                      padding: 10,
                      marginTop: 10,
                    }}
                  >
                    {logCollection.date}
                  </Text>
                  {/* Individual logs */}
                  <FlatList
                    data={logCollection.logs}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                      return (
                        // Card
                        <TouchableOpacity
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
                          activeOpacity={0.6}
                          onPress={() => {
                            openLogModal(
                              item,
                              logCollection.date,
                              getLocalTime(item["created_at"])
                            );
                          }}
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
                              {getLocalTime(item["created_at"])}
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
                        </TouchableOpacity>
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
    height: height,
    width: width,
  },
  emotionDetailTitle: {
    borderRadius: 30,
    marginBottom: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
