import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

interface Props {
  data: LogType[] | undefined;
  onReturn: () => void;
}

const { width, height } = Dimensions.get("window");

const DayDisplay = ({ data, onReturn }: Props) => {
  let hours: string[] = [];
  let day = {};

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
    if (!data) {
      return;
    }

    data.forEach((log) => {
      day;
    });
  };

  // @ts-expect-error
  const renderHours = ({ item }) => {
    return (
      <View style={{ paddingHorizontal: width * 0.04, alignItems: "center" }}>
        <Text style={{ color: "#555" }}>{item}</Text>
        <View
          style={{
            width: 0.02,
            height: 0.4,
            borderColor: "#aaa",
            borderWidth: width * 0.002,
            backgroundColor: "#aaa",
            flexGrow: 1,
          }}
        ></View>
      </View>
    );
  };
  // @ts-expect-error
  const renderLogs = ({ item }) => {
    return (
      <View style={{ position: "absolute", zIndex: 1 }}>
        <Text>{item.emotion}</Text>
      </View>
    );
  };

  useEffect(() => {
    sortLogsByHours();
  }, []);

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
        <Text>No logs on this day.</Text>
        <TouchableOpacity onPress={onReturn}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        width: width,
        height: height * 0.5,
        paddingHorizontal: width * 0.04,
      }}
    >
      {/* Hours in day */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={hours}
        renderItem={renderHours}
      />
      {/* Logs */}
      <FlatList scrollEnabled={false} data={data} renderItem={renderLogs} />
      <Button title="Go back" onPress={onReturn} />
    </View>
  );
};

export default DayDisplay;

const styles = StyleSheet.create({});
