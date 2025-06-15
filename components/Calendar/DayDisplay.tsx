import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getLocalTime, openLogModal, prettifyDate } from "@/assets/functions";

type LogByHourType = { [hour: number]: LogType[] };

interface Props {
  data: LogType[] | undefined;
  onReturn: () => void;
}

const { width, height } = Dimensions.get("window");

const DayDisplay = ({ data, onReturn }: Props) => {
  // ---------------------
  // STATES
  // ---------------------
  const [logsByHour, setLogsByHour] = useState<LogByHourType>([]);
  const [startIndex, setStartIndex] = useState<number | undefined>(undefined);

  // ---------------------
  // VARIABLES
  // ---------------------
  let hours: string[] = [];

  // ---------------------
  // FUNCTIONS
  // ---------------------
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
    const logsByHour: LogByHourType = [];
    if (!data) {
      return;
    }

    // Find first log of the day in order to automatically scroll to it when opening this day
    let earliest = 24;

    data.forEach((log) => {
      const time = Number((getLocalTime(log.created_at) as string).slice(0, 2));

      if (time < earliest) {
        earliest = time;
      }

      logsByHour[time]
        ? logsByHour[time].push(log)
        : (logsByHour[time] = [log]);
    });
    earliest > 0 ? setStartIndex(earliest - 1) : setStartIndex(earliest);

    setLogsByHour(logsByHour);
  };

  const renderLogs = (index: number) => {
    return (
      <View>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={logsByHour[index].length > 1 ? true : false}
          data={logsByHour[index]}
          renderItem={renderLogsByHour}
        />
      </View>
    );
  };

  const renderHours = ({ item, index }: { item: string; index: number }) => {
    return (
      <View
        style={{
          minWidth: width * 0.18,
          flexGrow: 1,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#555", marginBottom: 8 }}>{item}</Text>
        {logsByHour[index] ? (
          renderLogs(index)
        ) : (
          <View
            style={{
              width: 0.01,
              height: 0.4,
              borderColor: "rgba(0,0,0,0.1)",
              borderWidth: width * 0.004,
              flexGrow: 1,
            }}
          />
        )}
      </View>
    );
  };

  const renderLogsByHour = ({ item }: { item: LogType }) => {
    return (
      <TouchableOpacity
        style={{
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
            prettifyDate(getLocalTime(item.created_at, "both") as string),
            getLocalTime(item.created_at) as string
          )
        }
      >
        <Text>{item.emotion}</Text>
      </TouchableOpacity>
    );
  };

  // ---------------------
  // EFFECTS
  // ---------------------
  useEffect(() => {
    sortLogsByHours();
  }, []);

  // ---------------------
  // COMPONENT
  // ---------------------

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
      }}
    >
      {/* Hours in day */}
      {startIndex != undefined ? (
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
