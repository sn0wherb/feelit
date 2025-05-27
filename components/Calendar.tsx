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
import RenderMonth from "./RenderMonth";
import DayDisplay from "./DayDisplay";
import MonthDisplay from "./MonthDisplay";
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

type YearType = [Date[]];
type TinyEmotion = {
  id: number;
  created_at: string;
  color: string;
};

const { width, height } = Dimensions.get("window");

const Calendar = () => {
  // States
  const [calendar, setCalendar] = useState<YearType>([[]]);
  const [threeMonths, setThreeMonths] = useState<YearType>([[]]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [display, setDisplay] = useState<"Day" | "Month" | null>("Month");
  const [displayData, setDisplayData] = useState<LogType[]>();

  // Refs
  const monthFlatListRef = useRef<FlatList>(null);
  const currentMonthRef = useRef(0);
  const currentYearRef = useRef(2025);

  // Consts
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
  // const createThreeMonths = (
  //   yearNumber: number,
  //   currentMonthNumber: number
  // ) => {
  //   let months: YearType = [[]];
  //   months.pop(); // There's probably a beter way to initialize an empty typed array

  //   // Insert previous, current and next month
  //   for (
  //     let i = 0, monthNumber = currentMonthNumber - 1;
  //     i < 3;
  //     i++, monthNumber++
  //   ) {
  //     // Adjust for cross-year
  //     if (monthNumber == -1) {
  //       yearNumber--;
  //       monthNumber = 11;
  //     } else if (monthNumber == 12) {
  //       yearNumber++;
  //       monthNumber = 0;
  //     }

  //     months.push(createMonth(yearNumber, monthNumber));
  //   }
  //   return months;
  // };

  // const updateThreeMonths = (
  //   yearNumber: number,
  //   currentMonthNumber: number,
  //   direction: "back" | "forth"
  // ) => {
  //   const oldMonths = threeMonths;
  //   const newMonths = createThreeMonths(yearNumber, currentMonthNumber);

  //   // Back
  //   if (direction == "back") {
  //     oldMonths.unshift(newMonths[0]);
  //     oldMonths.pop();
  //   } else {
  //     // @ts-expect-error
  //     oldMonths.push(newMonths[2]);
  //     oldMonths.shift();
  //   }
  //   setThreeMonths(oldMonths);
  // };

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

  // @ts-expect-error
  const renderMonth = ({ item }) => {
    return <RenderMonth data={item} passOpenDay={handleOpenDay} />;
  };

  const handleOpenDay = (logs: LogType[], digit: number) => {
    setDisplay("Day");
    setDisplayData(logs);
    setSelectedDay(digit);
  };

  // // @ts-expect-error
  // const handleCurrentMonthChange = ({ viewableItems }) => {
  //   // In case data hasn't rendered yet, don't try to read undefined values
  //   if (!viewableItems[0] || viewableItems[0].item.length < 1) {
  //     return;
  //   }

  //   // Get data from current element
  //   const thisMonth = viewableItems[0].item[10].getMonth(),
  //     thisYear = viewableItems[0].item[10].getFullYear(),
  //     thisIndex = viewableItems[0].index;

  //   // Update visible current month title
  //   setSelectedMonth(thisMonth);

  //   // If currently landed on january, create and insert previous year
  //   if (thisIndex == 0) {
  //     updateThreeMonths(thisYear, thisMonth, "back");
  //     // If currently landed on december, create and insert next year
  //   } else if (thisIndex == 2) {
  //     updateThreeMonths(thisYear, thisMonth, "forth");
  //   }

  //   // Only update year value if itš different
  //   thisYear != selectedYear && setSelectedYear(thisYear);
  // };

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

  const getTitle = () => {
    switch (display) {
      case "Day":
        return (
          <Text style={styles.monthTitle}>
            {months[selectedMonth]} {selectedDay}, {selectedYear}
          </Text>
        );
      case "Month":
        return (
          <Text style={styles.monthTitle}>
            {months[selectedMonth]} {selectedYear}
          </Text>
        );
      default:
        return <View></View>;
    }
  };

  // Effects
  // useEffect(() => {
  //   setThreeMonths(createThreeMonths(selectedYear, selectedMonth));
  // }, []);

  // useEffect(() => {
  //   monthFlatListRef.current?.forceUpdate();
  // }, [threeMonths]);

  return (
    <View>
      <View style={styles.calendar}>
        {/* Currently viewed month and year name, and controls*/}
        <View style={styles.aboveMonthContainer}>
          <View style={styles.monthDisplayTopRow}>
            {display == "Day" && (
              <TouchableOpacity
                onPress={handleReturnFromDay}
                style={{
                  marginRight: 6,
                  backgroundColor: "rgba(0,0,0,0.06)",
                  borderRadius: 20,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                }}
              >
                <AntDesign name="arrowleft" size={26} color="black" />
              </TouchableOpacity>
            )}
            {getTitle()}
            {/* Button scrolling */}
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
            <MonthDisplay
              passHandleOpenDay={handleOpenDay}
              selectedMonth={selectedMonth}
              updateSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              updateSelectedYear={setSelectedYear}
            />
          </View>
        )}
        {display == "Day" && (
          <View>
            <DayDisplay data={displayData} onReturn={handleReturnFromDay} />
          </View>
        )}
      </View>
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
  monthDisplayTopRow: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
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
