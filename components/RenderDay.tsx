import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { MeshGradientView } from "expo-mesh-gradient";

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
  passOpenDay: (logs: LogType[], digit: number) => void;
}

const { width, height } = Dimensions.get("window");

const RenderDay = ({ digit, bounds, fullDate, passOpenDay }: Props) => {
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
              ORDER BY created_at ASC`
      );
      setLogsOfToday(data);
    } catch (e) {
      console.error(e);
    }
  };

  const createBackgroundFromLogColors = (data: LogType[]) => {
    if (data.length < 1) {
      return;
    } else {
      setColor(data[0].color);
    }
  };

  useEffect(() => {
    getLogsOfToday(fullDate);
  }, []);

  // Get colors
  const colors: string[] = [];
  for (let i = 0; i < logsOfToday.length; i++) {
    !colors.includes(logsOfToday[i].color) && colors.push(logsOfToday[i].color);
    i = colors.length === 3 ? logsOfToday.length : i;
  }

  // Create background
  switch (logsOfToday.length) {
    case 0:
      return (
        <TouchableOpacity
          style={styles[bounds]}
          onPress={() => passOpenDay(logsOfToday, digit)}
        >
          <Text style={styles.dayWithoutLogs}>{digit}</Text>
        </TouchableOpacity>
      );
    case 1:
      return (
        <TouchableOpacity
          style={[
            styles[bounds],
            {
              backgroundColor: logsOfToday[0].color,
            },
          ]}
          onPress={() => passOpenDay(logsOfToday, digit)}
        >
          <Text style={styles.dayWithLogs}>{digit}</Text>
        </TouchableOpacity>
      );
    default:
      return colors.length > 1 ? (
        // @ts-expect-error
        <LinearGradient colors={colors} style={styles.gradient}>
          <TouchableOpacity onPress={() => passOpenDay(logsOfToday, digit)}>
            <Text style={styles.dayWithLogs}>{digit}</Text>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          style={[styles[bounds], { backgroundColor: colors[0] }]}
          onPress={() => passOpenDay(logsOfToday, digit)}
        >
          <Text style={styles.dayWithLogs}>{digit}</Text>
        </TouchableOpacity>
      );
  }
};

export default memo(RenderDay);

const styles = StyleSheet.create({
  gradient: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 2,
    borderRadius: 20,
  },
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
  dayWithoutLogs: {
    color: "#666",
  },
  dayWithLogs: {
    color: "#eee",
    fontSize: 20,
    // Shadow
    shadowColor: "#eee",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
