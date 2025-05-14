import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLocalTime, openLogModal, prettifyDate } from "@/assets/functions";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

type LogByHourType = { [hour: number]: LogType[] };

interface Props {
  data: LogType[] | undefined;
  onReturn: () => void;
}

const { width, height } = Dimensions.get("window");

const DayDisplay = ({ data, onReturn }: Props) => {
  // States
  const [logsByHour, setLogsByHour] = useState<LogByHourType>({});
  const [firstEntry, setFirstEntry] = useState(true);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  let hours: string[] = [];

  const populateHours = () => {
    for (let i = 0; i < 25; i++) {
      if (i < 10) {
        hours.push(`0${i}:00`);
      } else {
        hours.push(`${i}:00`);
      }
    }
  };

  populateHours();

  const sortLogsByHours = () => {
    const logsByHour = {};
    if (!data) {
      return;
    }
    let earliest = 24;

    data.forEach((log) => {
      const time = Number(getLocalTime(log.created_at).slice(0, 2));

      if (time < earliest) {
        earliest = time;
      }

      // @ts-expect-error
      logsByHour[time]
        ? // @ts-expect-error
          logsByHour[time].push(log)
        : // @ts-expect-error
          (logsByHour[time] = [log]);
    });
    earliest > 0 ? setStartIndex(earliest - 1) : setStartIndex(earliest);
    setLogsByHour(logsByHour);
  };

  const renderLogs = (index: number) => {
    return (
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={logsByHour[index].length > 1 ? true : false}
        data={logsByHour[index]}
        renderItem={renderLogsByHour}
      />
      /* <View
              style={{
                width: 0.02,
                height: 0.4,
                borderColor: "#aaa",
                borderWidth: width * 0.002,
                backgroundColor: "#aaa",
                flexGrow: 1,
              }}
            ></View> */
    );
  };

  // @ts-expect-error
  const renderHours = ({ item, index }) => {
    return (
      <View
        style={{
          minWidth: width * 0.18,
          flexGrow: 1,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#555", marginBottom: 8 }}>{item}</Text>
        <View
          style={{
            width: 0.01,
            height: 0.4,
            borderColor: "rgba(0,0,0,0.1)",
            borderWidth: width * 0.004,
            // backgroundColor: "#aaa",
            flexGrow: 1,
          }}
        ></View>
        {logsByHour[index] && renderLogs(index)}
      </View>
    );
  };

  // @ts-expect-error
  const renderLogsByHour = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          // position: "absolute",
          // zIndex: 1,
          height: width * 0.22,
          width: width * 0.24,
          marginVertical: 6,
          backgroundColor: item.color,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          // Shadow
          shadowColor: String(item.color),
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        }}
        onPress={() =>
          openLogModal(
            item,
            prettifyDate(item.created_at),
            getLocalTime(item.created_at)
          )
        }
      >
        <Text>{item.emotion}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    sortLogsByHours();
  }, []);

  // No logs on this day
  if (!data || !data[0]) {
    return (
      <View
        style={{
          width: width,
          height: height * 0.5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>No logs on this day.</Text>
      </View>
    );
  }

  // Logs exist on this day
  return (
    <View
      style={{
        width: width,
        height: height * 0.5,
        // paddingHorizontal: width * 0.04,
      }}
    >
      {/* Hours in day */}
      {startIndex ? (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          initialScrollIndex={startIndex}
          getItemLayout={(_item, index) => ({
            length: width * 0.18,
            offset: width * 0.18 * index,
            index,
          })}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={hours}
          renderItem={renderHours}
        />
      ) : (
        <ActivityIndicator size={"large"} />
      )}
    </View>
  );
};

export default DayDisplay;

const styles = StyleSheet.create({});
