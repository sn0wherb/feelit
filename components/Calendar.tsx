import {
  Button,
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
import CalendarDay from "./CalendarDay";
import DaysInMonth from "./DaysInMonth";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

type YearType = [Date[]];
type TinyEmotion = {
  id: number;
  created_at: string;
  color: string;
};

const { width, height } = Dimensions.get("window");

const Calendar = () => {
  const [calendar, setCalendar] = useState<YearType>([[]]);
  const [threeMonths, setThreeMonths] = useState<YearType>([[]]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [index, setIndex] = useState(0);
  const [scrollToMonth, setScrollToMonth] = useState(0);
  const [display, setDisplay] = useState<"Day" | "Month" | null>("Month");
  const [displayData, setDisplayData] = useState<LogType[]>();

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
  const createThreeMonths = (
    yearNumber: number,
    currentMonthNumber: number
  ) => {
    let months: YearType = [[]];
    months.pop(); // There's probably a beter way to initialize an empty typed array

    // Insert previous, current and next month
    for (
      let i = 0, monthNumber = currentMonthNumber - 1;
      i < 3;
      i++, monthNumber++
    ) {
      // Adjust for cross-year
      if (monthNumber == -1) {
        yearNumber--;
        monthNumber = 11;
      } else if (monthNumber == 12) {
        yearNumber++;
        monthNumber = 0;
      }

      months.push(createMonth(yearNumber, monthNumber));
    }
    return months;
  };

  const updateThreeMonths = (
    yearNumber: number,
    currentMonthNumber: number,
    direction: "back" | "forth"
  ) => {
    const oldMonths = threeMonths;
    const newMonths = createThreeMonths(yearNumber, currentMonthNumber);

    // Back
    if (direction == "back") {
      oldMonths.unshift(newMonths[0]);
      oldMonths.pop();
    } else {
      // @ts-expect-error
      oldMonths.push(newMonths[2]);
      oldMonths.shift();
    }
    setThreeMonths(oldMonths);
  };

  const createMonth = (yearNumber: number, monthNumber: number) => {
    let month: Date[] = [];

    // console.log(months[monthNumber]);

    // Get number of days in current month
    const dayCountOfMonth: number = getDayCountOfMonth(monthNumber);

    // Populate current month with days
    for (let j = 1; j <= dayCountOfMonth; j++) {
      const day = new Date(Date.UTC(yearNumber, monthNumber, j));

      // Insert days of previous month
      if (j == 1) {
        const firstWeekdayOfMonth = day.getDay();
        // If this month doesn't start with a Monday, create a full week by inserting days from the previous month
        if (firstWeekdayOfMonth == 0 || firstWeekdayOfMonth > 1) {
          // Convert sunday from 0 to 7
          const fillerDays =
            firstWeekdayOfMonth == 0 ? 6 : firstWeekdayOfMonth - 1;
          // Insert days from previous month as the first elements in this array
          for (let k = fillerDays; k > 0; k--) {
            const previousMonthDay = new Date(day);
            previousMonthDay.setDate(day.getDate() - k);
            month.push(previousMonthDay);
          }
        }
      }
      // Days inside this month
      month.push(day);

      // If last day of month is not Sunday, fill with days of next month until Sunday
      if (j == dayCountOfMonth) {
        const lastWeekdayOfMonth = day.getDay();
        if (lastWeekdayOfMonth > 0) {
          const fillerDays = 7 - lastWeekdayOfMonth;
          // console.log("filler: " + fillerDays);
          for (let k = 0; k < fillerDays; k++) {
            const nextMonthDay = new Date(day);
            nextMonthDay.setDate(day.getDate() + k);
            month.push(nextMonthDay);
          }
        }
      }
    }

    return month;
  };

  const getDayCountOfMonth = (monthNumber: number) => {
    switch (monthNumber) {
      // February
      case 1:
        // Check for leap year
        return new Date(monthNumber, 1, 29).getDate() === 29 ? 29 : 28;
      // Months with 30 days
      case 3: // fallthrough
      case 5: // fallthrough
      case 8: // fallthrough
      case 10:
        return 30;
      // Months with 31 days
      default:
        return 31;
    }
  };

  const createYear = (yearNumber: number) => {
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
            new Date(yearNumber, 1, 29).getDate() === 29 ? 29 : 28;
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
        const day = new Date(Date.UTC(yearNumber, i, j));
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
    return year;
  };

  const updateCalendar = (yearNumber: number) => {
    const year = createYear(yearNumber);
    const currentCalendar = calendar;

    if (yearNumber < selectedYear) {
      for (let i = year.length; i > 0; i--) {
        currentCalendar?.unshift(year[i - 1]);
        // currentCalendar.pop();
      }
      setCalendar(currentCalendar);
    } else {
      for (let i = 0; i < year.length; i++) {
        currentCalendar?.push(year[i]);
      }
      setCalendar(currentCalendar);
    }
  };

  // @ts-expect-error
  const renderMonth = ({ item }) => {
    return <DaysInMonth data={item} passOpenDay={handleOpenDay} />;
  };

  const keyExtractor = (index: any) => "key-" + index.toString();

  const handleOpenDay = (logs: LogType[]) => {
    setDisplay("Day");
    setDisplayData(logs);
  };

  // Note: this was originally used with a callback, but that breaks functionality.
  // @ts-expect-error
  const handleCurrentMonthChange = ({ viewableItems }) => {
    if (!viewableItems[0] || viewableItems[0].item.length < 1) {
      return;
    }

    const thisMonth = viewableItems[0].item[10].getMonth(),
      thisYear = viewableItems[0].item[10].getFullYear(),
      thisIndex = viewableItems[0].index;

    // console.log("currentMonth = " + (thisMonth + 1));

    // Update visible current month title
    // TO-DO: change this to be a separate function that tracks an index? that would still take a state... ughhh ig i gotta optimize
    setSelectedMonth(thisMonth);

    // If currently landed on january, create and insert previous year
    if (thisIndex == 0) {
      // console.log("index = 0");
      updateThreeMonths(thisYear, thisMonth, "back");
      // If currently landed on december, create and insert next year
    } else if (thisIndex == 2) {
      // console.log("index = 2");
      updateThreeMonths(thisYear, thisMonth, "forth");
    }

    thisYear != selectedYear && setSelectedYear(thisYear);
  };

  const handleReturnFromDay = () => {
    setDisplay("Month");
  };

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
    setThreeMonths(createThreeMonths(selectedYear, selectedMonth));
  }, []);

  useEffect(() => {
    monthFlatListRef.current?.forceUpdate();
  }, [threeMonths]);

  // useEffect(() => {
  //   monthFlatListRef.current?.({ indexscrollToIndex, animated: false });
  // }, [scrollToMonth]);

  const monthFlatListRef = useRef<FlatList>(null);
  const currentMonthRef = useRef(0);
  const currentYearRef = useRef(2025);

  // // @ts-expect-error
  // if (threeMonths[1]) {
  //   console.log("", threeMonths[0][10].toLocaleDateString());
  // }

  return (
    <View>
      {/* Whole year */}
      {getYear && (
        <View style={styles.calendar}>
          {/* Currently viewed month and year name, and controls*/}
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
          </View>
          {display == "Month" && (
            <View>
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
              {/* Month */}
              <FlatList
                showsHorizontalScrollIndicator={false}
                ref={monthFlatListRef}
                horizontal
                pagingEnabled
                keyExtractor={keyExtractor}
                getItemLayout={(_item, index) => ({
                  length: width,
                  offset: width * index,
                  index,
                })}
                maintainVisibleContentPosition={{
                  minIndexForVisible: 0,
                }}
                initialScrollIndex={1}
                contentContainerStyle={styles.monthDisplay}
                data={threeMonths}
                renderItem={renderMonth}
                onViewableItemsChanged={handleCurrentMonthChange}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              />
            </View>
          )}
          {display == "Day" && (
            <View>
              <CalendarDay data={displayData} onReturn={handleReturnFromDay} />
            </View>
          )}
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
