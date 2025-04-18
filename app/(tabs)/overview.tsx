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

    const isInWeek = (date: Date) => {
      for (let i = 0; i < 5; i++) {
        const comparisonDate = date;
        comparisonDate.setDate(date.getDate() + i);

        if (String(comparisonDate).slice(0, 10) == String(today).slice(0, 10)) {
          if (i == 0) {
            return "Today";
          } else if (i == 1) {
            return "Yesterday";
          }
          return date.toLocaleDateString("default", { weekday: "long" });
        }
      }
      return false;
    };

    // Iterate through each log
    data.map((value) => {
      let date = value.created_at.slice(0, 10);
      let dateFormat = new Date(value.created_at);

      const inWeek = isInWeek(dateFormat);

      // FORMAT DATE
      if (inWeek) {
        date = inWeek;
      } else {
        let parts = date.split("-");
        let newDate = new Date(
          Number(parts[0]),
          Number(parts[1]) - 1,
          Number(parts[2])
        );

        const dayString = String(
            newDate.toLocaleDateString("default", { weekday: "long" })
          ),
          dateString = String(newDate.getDate()),
          monthString = String(
            newDate.toLocaleDateString("default", { month: "long" })
          ),
          yearString = String(newDate.getFullYear());

        // If year == current year, display weekday name, but not year. Otherwise, don't display weekday name, but display year.
        date =
          yearString == String(today.getFullYear())
            ? `${dayString}, ${dateString} ${monthString}`
            : `${dateString} ${monthString} ${yearString}`;
      }

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

  // const openLogModal = () => {
  //   const params = {};
  //   router.push({
  //     pathname: "/logModal",
  //     params: params,
  //   });
  // };

  return (
    <SafeAreaView style={styles.container}>
      {/* If there are no logs yet */}
      {logData.length == 0 && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{ marginHorizontal: 32, fontSize: 30, textAlign: "center" }}
          >
            Your logged emotions will appear here!
          </Text>
        </View>
      )}
      {/* <Text>Overview</Text> */}
      <View style={{ paddingHorizontal: 8, height: height, width: width }}>
        <Modal visible={isModalOpen} transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.2)",
              paddingVertical: 50,
            }}
          >
            <View
              style={{
                backgroundColor: modalData?.color,
                width: width * 0.8,
                flex: 1,
                borderWidth: 2,
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
                  {modalData?.emotion}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalOpen(false);
                  }}
                >
                  <AntDesign name="close" size={32} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sorted by date */}
          <FlatList
            contentContainerStyle={{ paddingBottom: 140, paddingTop: 10 }}
            data={logDataByDate}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const logCollection = item;
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
