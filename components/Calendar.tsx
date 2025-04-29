import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

type YearType = [Date[]];

const { width, height } = Dimensions.get("window");

const Calendar = () => {
  const [calendar, setCalendar] = useState<YearType>([[]]);
  const [selectedYear, setSelectedYear] = useState(
    new Date().toLocaleDateString("default", { year: "numeric" })
  );
  const [selectedMonth, setSelectedMonth] = useState(0);
  const getYear = false;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekdays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

  const createCalendar = () => {
    const currentYear = new Date().getFullYear();
    let year: YearType = [[]];
    for (let i = 1; i <= 12; i++) {
      // Insert new month
      year.push([]);
      // Get number of days in current month
      let numOfDaysInCurrentMonth: number;
      switch (i) {
        // February
        case 2:
          // Check for leap year
          numOfDaysInCurrentMonth =
            new Date(currentYear, 1, 29).getDate() === 29 ? 29 : 28;
          break;
        // Months with 30 days
        case 4: // fallthrough
        case 6: // fallthrough
        case 9: // fallthrough
        case 11:
          numOfDaysInCurrentMonth = 30;
          break;
        // Months with 31 days
        default:
          numOfDaysInCurrentMonth = 31;
          break;
      }
      // Populate current month with days
      for (let j = 1; j <= numOfDaysInCurrentMonth; j++) {
        const day = new Date(currentYear, i - 1, j);
        year[i].push(day);
      }
    }
    // Remove empty entry created at initialization
    year.shift();
    setCalendar(year);
  };

  useEffect(() => {
    createCalendar();
  }, []);

  return (
    <View>
      {/* Month display */}
      <View style={styles.monthDisplay}>
        {/* Currently selected month and year, and controls*/}
        <View style={styles.monthDisplayTopRow}>
          <Text style={styles.monthTitle}>
            {months[selectedMonth]} {selectedYear}
          </Text>
          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controls}
              onPress={() => {
                selectedMonth > 0 &&
                  setSelectedMonth((selectedMonth) => selectedMonth - 1);
              }}
            >
              <Entypo name="chevron-left" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controls}
              onPress={() => {
                selectedMonth < 11 &&
                  setSelectedMonth((selectedMonth) => selectedMonth + 1);
              }}
            >
              <Entypo name="chevron-right" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Weekdays */}
        <FlatList
          scrollEnabled={false}
          data={weekdays}
          numColumns={7}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.weekday} key={"weekday-" + index}>
                <Text style={styles.weekdayTitle}>{item}</Text>
              </View>
            );
          }}
        />
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={styles.dayContainer}
          numColumns={7}
          data={calendar[selectedMonth]}
          renderItem={({ item }) => {
            // Days
            return (
              <View style={styles.day} key={"day" + item}>
                <Text>
                  {item.toLocaleDateString("default", {
                    day: "2-digit",
                  })}
                </Text>
              </View>
            );
          }}
        />
      </View>
      {/* Whole year */}
      {getYear && (
        <FlatList
          data={calendar}
          renderItem={({ item, index }) => {
            // Month
            return (
              <View style={styles.monthDisplay}>
                <Text style={styles.monthTitle}>{months[index]}</Text>
                {/* Weekdays */}
                <FlatList
                  data={weekdays}
                  numColumns={7}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={styles.weekday} key={"weekday-" + index}>
                        <Text style={styles.weekdayTitle}>{item}</Text>
                      </View>
                    );
                  }}
                />
                <FlatList
                  contentContainerStyle={styles.dayContainer}
                  numColumns={7}
                  data={item}
                  key={"month-" + index}
                  renderItem={({ item }) => {
                    // Days
                    return (
                      <View style={styles.day} key={"day" + item}>
                        <Text>
                          {item.toLocaleDateString("default", {
                            day: "2-digit",
                          })}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  monthDisplay: {
    height: height * 0.5,
    // borderWidth: 2,
    // width: width,
    // height: height * 0.6,
  },
  monthDisplayTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthTitle: {
    marginLeft: 6,
    marginTop: 10,
    fontSize: 26,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: width * 0.04,
    paddingRight: width * 0.02,
  },
  controls: {
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 50,
    padding: 4,
  },
  dayContainer: {
    // borderWidth: 2,
  },
  weekday: {
    width: width * 0.12,
    height: width * 0.06,
    // borderWidth: 2,
    alignItems: "center",
    margin: 2,
  },
  weekdayTitle: {
    fontSize: 16,
    color: "#555",
  },
  day: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
  },
});
