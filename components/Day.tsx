import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import { useSQLiteContext } from "expo-sqlite";

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
  digit: number;
  bounds: "outside" | "inside";
  fullDate: Date;
  passOpenDay: (logs: LogType[]) => void;
}

const { width, height } = Dimensions.get("window");

const Day = ({ digit, bounds, fullDate, passOpenDay }: Props) => {
  const db = useSQLiteContext();
  const [logsOfToday, setLogsOfToday] = useState<LogType[]>([]);
  const [color, setColor] = useState<String | null>(null);

  // Functions
  const getLogsOfToday = async (date: Date) => {
    const dateString = date.toISOString().slice(0, 10);
    try {
      const data = await db.getAllAsync<LogType>(
        `SELECT *
              FROM emotion_logs
              WHERE created_at LIKE '${dateString}%'
              ORDER BY created_at DESC`
      );
      setLogsOfToday(data);
      createBackgroundFromLogColors(data);
    } catch (e) {
      console.error(e);
    }
  };

  const createBackgroundFromLogColors = (data: LogType[]) => {
    // data.forEach(value => {

    // })
    if (data.length < 1) {
      return;
    } else {
      setColor(data[0].color);
    }
  };

  useEffect(() => {
    getLogsOfToday(fullDate);
  }, []);

  return (
    <TouchableOpacity
      style={[
        styles[bounds],
        {
          backgroundColor: color
            ? String(color)
            : styles[bounds].backgroundColor,
        },
      ]}
      onPress={() => passOpenDay(logsOfToday)}
    >
      <Text style={styles.dayOutsideMonth}>{digit}</Text>
    </TouchableOpacity>
  );
};

export default memo(Day);

const styles = StyleSheet.create({
  outside: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 2,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 20,
  },
  inside: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
  },
  dayOutsideMonth: {
    color: "#666",
  },
});
