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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(0);
  const getYear = false;
  const getMonth = true;
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

  // Functions

  const createCalendar = () => {
    let year: YearType = [[]];
    for (let i = 0; i < 12; i++) {
      // Insert new month
      year.push([]);
      // Get number of days in current month
      let numOfDaysInCurrentMonth: number;
      switch (i) {
        // February
        case 1:
          // Check for leap year
          numOfDaysInCurrentMonth =
            new Date(selectedYear, 1, 29).getDate() === 29 ? 29 : 28;
          break;
        // Months with 30 days
        case 3: // fallthrough
        case 5: // fallthrough
        case 8: // fallthrough
        case 10:
          numOfDaysInCurrentMonth = 30;
          break;
        // Months with 31 days
        default:
          numOfDaysInCurrentMonth = 31;
          break;
      }

      // Populate current month with days
      for (let j = 1; j <= numOfDaysInCurrentMonth; j++) {
        const day = new Date(Date.UTC(selectedYear, i, j));

        // If first day of month is not a Monday, insert days from previous month up until the 1st of this month
        if (j == 1) {
          // Get weekday of first day in this month
          const firstWeekdayOfMonth = day.getDay();

          // If weekday is not monday
          if (firstWeekdayOfMonth == 0 || firstWeekdayOfMonth > 1) {
            // Convert sunday from 0 to 7
            const fillerDays =
              firstWeekdayOfMonth == 0 ? 6 : firstWeekdayOfMonth - 1;
            // Insert days from previous month as the first elements in this array
            for (let k = fillerDays; k > 0; k--) {
              const previousMonthDay = new Date();
              previousMonthDay.setDate(day.getDate() - k);
              year[i].push(previousMonthDay);
            }
          }
        }

        year[i].push(day);

        // If last day of month is not Sunday, fill with days of next month until Sunday
        if (j == numOfDaysInCurrentMonth) {
          const lastWeekdayOfMonth = day.getDay();
          // console.log("last weekday: " + day);

          if (lastWeekdayOfMonth > 0) {
            const fillerDays = 7 - lastWeekdayOfMonth;
            // console.log("filler: " + fillerDays);
            for (let k = 0; k < fillerDays; k++) {
              const nextMonthDay = new Date();
              nextMonthDay.setDate(day.getDate() + k);
              // console.log(k);
              year[i].push(nextMonthDay);
            }
          }
        }
      }
    }
    // Remove empty entry created at initialization
    // year.shift();
    setCalendar(year);
  };

  const monthBack = () => {
    if (selectedMonth > 0) {
      setSelectedMonth((selectedMonth) => selectedMonth - 1);
    } else {
      setSelectedYear((selectedYear) => selectedYear - 1);
      setSelectedMonth(11);
    }
  };

  const monthForward = () => {
    if (selectedMonth < 11) {
      setSelectedMonth((selectedMonth) => selectedMonth + 1);
    } else {
      setSelectedYear((selectedYear) => selectedYear + 1);
      setSelectedMonth(0);
    }
  };

  useEffect(() => {
    createCalendar();
  }, [selectedYear]);

  return (
    <View>
      {/* Month display */}
      {getMonth && (
        <View style={styles.monthDisplay}>
          {/* Currently selected month and year name, and controls*/}
          <View style={styles.monthDisplayTopRow}>
            <Text style={styles.monthTitle}>
              {months[selectedMonth]} {selectedYear}
            </Text>
            {/* Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.controls} onPress={monthBack}>
                <Entypo name="chevron-left" size={28} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controls} onPress={monthForward}>
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
            renderItem={({ item, index }) => {
              const dayDigit = item.toLocaleDateString("default", {
                day: "2-digit",
              });
              // Days in previous month
              if (index < 7 && Number(dayDigit) > 7) {
                return (
                  <View style={styles.outsideOfMonthDay} key={"day" + item}>
                    <Text style={styles.dayOutsideMonth}>{dayDigit}</Text>
                  </View>
                );
                //   // Days in next month
              } else if (index > 20 && Number(dayDigit) < 7) {
                return (
                  <View style={styles.outsideOfMonthDay} key={"day" + item}>
                    <Text style={styles.dayOutsideMonth}>{dayDigit}</Text>
                  </View>
                );
              }
              // Days in this month
              return (
                <View style={styles.day} key={"day" + item}>
                  <Text>{dayDigit}</Text>
                </View>
              );
            }}
          />
        </View>
      )}
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
    height: height * 0.56,
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
    // flex: 1,
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
  outsideOfMonthDay: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 2,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 20,
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
  dayOutsideMonth: {
    color: "#666",
  },
});
