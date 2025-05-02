import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

type YearType = [Date[]];

const { width, height } = Dimensions.get("window");

const Calendar = () => {
  const [calendar, setCalendar] = useState<YearType>([[]]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [generateCalendar, setGenerateCalendar] = useState(0);
  const getYear = true;
  const getMonth = false;
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
    // Create calendar consisting of previous, current and next year
    let threeYears: YearType = [[]];
    for (let h = -1; h < 2; h++) {
      const thisYear = currentYearRef.current + h;
      // Create year
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
              new Date(thisYear, 1, 29).getDate() === 29 ? 29 : 28;
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
          const day = new Date(Date.UTC(thisYear, i, j));
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
                const previousMonthDay = new Date(day);
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
                const nextMonthDay = new Date(day);
                nextMonthDay.setDate(day.getDate() + k);
                year[i].push(nextMonthDay);
              }
            }
          }
        }
      }
      // I honestly don't know where that empty array is coming from at the end but who cares long as it works
      year.pop();
      year.forEach((value) => {
        threeYears.push(value);
      });
      console.log(threeYears);
    }

    // Remove empty entry created at initialization
    threeYears.shift();
    setCalendar(threeYears);
  };

  const handleCurrentMonthChange = useCallback(({ viewableItems }) => {
    setSelectedMonth(viewableItems[0].item[10].getMonth());
    // console.log(viewableItems);
    // console.log(selectedYear);
    // console.log(viewableItems[0].item[10].getFullYear());
    if (viewableItems[0].item[10].getFullYear() != currentYearRef.current) {
      currentYearRef.current = viewableItems[0].item[10].getFullYear();
      setSelectedYear(viewableItems[0].item[10].getFullYear());
      setGenerateCalendar((generateCalendar) => generateCalendar++);
    }
  }, []);

  const monthBack = () => {
    if (currentMonthRef.current > 0) {
      // setSelectedMonth((selectedMonth) => selectedMonth - 1);
      currentMonthRef.current--;
    } else {
      currentMonthRef.current++;
      currentYearRef.current--;
      // setSelectedYear((selectedYear) => selectedYear - 1);
      // setSelectedMonth(11);
    }
  };

  const monthForward = () => {
    if (currentMonthRef.current < 11) {
      currentMonthRef.current++;
      // setSelectedMonth((selectedMonth) => selectedMonth + 1);
    } else {
      currentMonthRef.current--;
      currentYearRef.current++;
      // setSelectedYear((selectedYear) => selectedYear + 1);
      // setSelectedMonth(0);
    }
  };

  useEffect(() => {
    createCalendar();
    console.log(1);
  }, [generateCalendar]);

  const monthRef = useRef<FlatList>(null);
  const currentMonthRef = useRef(0);
  const currentYearRef = useRef(2025);

  // useEffect(() => {}, []);

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
                // Days in next month
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
        <View style={styles.calendar}>
          {/* Currently selected month and year name, and controls*/}
          <View style={styles.aboveMonthContainer}>
            <View style={styles.monthDisplayTopRow}>
              <Text style={styles.monthTitle}>
                {months[selectedMonth]} {selectedYear}
              </Text>
              {/* Controls */}
              {/* <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.controls} onPress={monthBack}>
                  <Entypo name="chevron-left" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controls}
                  onPress={monthForward}
                >
                  <Entypo name="chevron-right" size={28} color="black" />
                </TouchableOpacity>
              </View> */}
            </View>
            {/* Weekdays */}
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={styles.weekdaysContainer}
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
          </View>
          {/* Month */}
          <FlatList
            ref={monthRef}
            horizontal
            pagingEnabled
            getItemLayout={(_item, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            initialScrollIndex={12}
            contentContainerStyle={styles.monthDisplay}
            data={calendar}
            renderItem={({ item }) => {
              return (
                // All days of this month
                <FlatList
                  scrollEnabled={false}
                  contentContainerStyle={styles.dayContainer}
                  numColumns={7}
                  data={item}
                  renderItem={({ item, index }) => {
                    const dayDigit = item.toLocaleDateString("default", {
                      day: "numeric",
                    });
                    // Days in previous month
                    if (index < 7 && Number(dayDigit) > 7) {
                      return (
                        <View
                          style={styles.outsideOfMonthDay}
                          key={"day" + item}
                        >
                          <Text style={styles.dayOutsideMonth}>{dayDigit}</Text>
                        </View>
                      );
                      // Days in next month
                    } else if (index > 20 && Number(dayDigit) < 7) {
                      return (
                        <View
                          style={styles.outsideOfMonthDay}
                          key={"day" + item}
                        >
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
              );
            }}
            onViewableItemsChanged={handleCurrentMonthChange}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
        </View>
      )}
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  calendar: {
    height: height * 0.56,
    width: width,
    // borderWidth: 2,
  },
  aboveMonthContainer: {
    width: width,
    // borderWidth: 2,
    paddingHorizontal: width * 0.046,
  },
  weekdaysContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  monthDisplay: {
    // borderWidth: 2,
    // justifyContent: "center",
    // alignItems: "center",
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
    width: width,
    alignItems: "center",
    justifyContent: "center",
    // padding: width * 0.02,
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
