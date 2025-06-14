import {
  ColorValue,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { getLocalTime } from "@/assets/functions";

interface Props {
  digit: number;
  bounds: "outside" | "inside";
  fullDate: Date;
  passOpenDay: (logs: LogType[], digit: number) => void;
}

const { width } = Dimensions.get("window");

const RenderDay = ({ digit, bounds, fullDate, passOpenDay }: Props) => {
  // ---------------------
  // CONSTS
  // ---------------------
  const db = useSQLiteContext();

  const today = new Date().toLocaleDateString();
  const fullDateString = getLocalTime(fullDate, "date") as string;
  const isToday = today === fullDateString;

  const colors: ColorValue[] = [];

  // ---------------------
  // EFFECTS
  // ---------------------
  const [logsOfToday, setLogsOfToday] = useState<LogType[]>([]);

  // ---------------------
  // FUNCTIONS
  // ---------------------
  const getLogsOfToday = async (date: Date) => {
    const yesterdayDate = date;
    yesterdayDate.setDate(date.getDate() - 1);
    const yesterdayString = yesterdayDate.toISOString().slice(0, 10);
    const dateString = date.toISOString().slice(0, 10);
    const tomorrowDate = date;
    tomorrowDate.setDate(date.getDate() + 1);
    const tomorrowString = yesterdayDate.toISOString().slice(0, 10);

    // Get yesterday's, today's and tomorrow's logs
    try {
      const data = await db.getAllAsync<LogType>(
        `SELECT *
              FROM emotion_logs
              WHERE created_at LIKE '${yesterdayString}%' OR created_at LIKE '${dateString}%' OR created_at LIKE '${tomorrowString}%'
              ORDER BY created_at ASC`
      );
      // Go through all logs and convert date to local time
      let filteredData: LogType[] = [];
      data.forEach((log) => {
        // If local time date falls in today, add it to data
        getLocalTime(log.created_at, "date").toString().slice(0, 10) ==
          fullDateString.slice(0, 10) && filteredData.push(log);
      });
      setLogsOfToday(filteredData);
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------------
  // EFFECTS
  // ---------------------
  useEffect(() => {
    getLogsOfToday(fullDate);
  }, []);

  // Get colors from emotions in logs
  for (let i = 0; i < logsOfToday.length; i++) {
    // Colors don't repeat
    !colors.includes(logsOfToday[i].color) && colors.push(logsOfToday[i].color);
    // Stop loop if 3 colors have been added
    i = colors.length === 3 ? logsOfToday.length : i;
  }

  // ---------------------
  // COMPONENT
  // ---------------------
  switch (logsOfToday.length) {
    case 0:
      return (
        <TouchableOpacity
          style={[
            styles[bounds],
            {
              borderWidth: isToday ? 3 : 0,
              borderColor: "rgb(222, 122, 102)",
            },
          ]}
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
              borderWidth: isToday ? 3 : 0,
              borderColor: "rgb(222, 122, 102)",
            },
          ]}
          onPress={() => passOpenDay(logsOfToday, digit)}
        >
          <Text style={styles.dayWithLogs}>{digit}</Text>
        </TouchableOpacity>
      );
    default:
      return colors.length > 1 ? (
        // I believe this use of ts-expect-error is justified
        // @ts-expect-error
        <LinearGradient colors={colors} style={styles.gradient}>
          <TouchableOpacity
            onPress={() => passOpenDay(logsOfToday, digit)}
            style={[
              styles[bounds],
              {
                borderWidth: isToday ? 3 : 0,
                borderColor: "rgb(222, 122, 102)",
              },
            ]}
          >
            <Text style={styles.dayWithLogs}>{digit}</Text>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          style={[
            styles[bounds],
            {
              backgroundColor: colors[0],
              borderWidth: isToday ? 3 : 0,
              borderColor: "rgb(222, 122, 102)",
            },
          ]}
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
    margin: 2,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 20,
  },
  inside: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
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
