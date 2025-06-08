import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useEffect, useRef, useState } from "react";
import RenderMonth from "./RenderMonth";
// import { keyExtractor } from "@/assets/functions";

const { width, height } = Dimensions.get("window");

interface Props {
  passHandleOpenDay: (logs: LogType[], digit: number) => void;
  selectedMonth: number;
  updateSelectedMonth: (month: number) => void;
  selectedYear: number;
  updateSelectedYear: (month: number) => void;
}

const MonthDisplay = ({
  passHandleOpenDay,
  selectedMonth,
  updateSelectedMonth,
  selectedYear,
  updateSelectedYear,
}: Props) => {
  // States
  const [threeMonths, setThreeMonths] = useState<YearType>([[]]);

  // Consts
  const weekdays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

  // Refs
  const monthFlatListRef = useRef<FlatList>(null);

  // Functions
  const keyExtractor = (item: Date[]) => 'key-' + item[10].toString();

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

  //@ts-expect-error
  const renderMonth = ({ item }) => {
    return <RenderMonth data={item} passOpenDay={passHandleOpenDay} />;
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

  // @ts-expect-error
  const handleCurrentMonthChange = ({ viewableItems }) => {
    // In case data hasn't rendered yet, don't try to read undefined values
    if (!viewableItems[0] || viewableItems[0].item.length < 1) {
      return;
    }

    // Get data from current element
    const thisMonth = viewableItems[0].item[10].getMonth(),
      thisYear = viewableItems[0].item[10].getFullYear(),
      thisIndex = viewableItems[0].index;

    // Update visible current month title
    updateSelectedMonth(thisMonth);

    // If currently landed on january, create and insert previous year
    if (thisIndex == 0) {
      updateThreeMonths(thisYear, thisMonth, "back");
      // If currently landed on december, create and insert next year
    } else if (thisIndex == 2) {
      updateThreeMonths(thisYear, thisMonth, "forth");
    }

    // Only update year value if itš different
    thisYear != selectedYear && updateSelectedYear(thisYear);
  };

  useEffect(() => {
    setThreeMonths(createThreeMonths(selectedYear, selectedMonth));
  }, []);

  useEffect(() => {
    monthFlatListRef.current?.forceUpdate();
  }, [threeMonths]);

  return (
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
      {threeMonths.length > 1 ? (
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
          data={threeMonths}
          renderItem={renderMonth}
          onViewableItemsChanged={handleCurrentMonthChange}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
      ) : (
        // Loading
        <View
          style={{
            height: height * 0.46,
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      )}
    </View>
  );
};

export default memo(MonthDisplay);

const styles = StyleSheet.create({
  weekdaysContainer: {
    alignItems: "center",
    justifyContent: "center",
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
});
