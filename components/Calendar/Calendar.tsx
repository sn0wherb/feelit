import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import DayDisplay from "./DayDisplay";
import MonthDisplay from "./MonthDisplay";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

const Calendar = () => {
  // ---------------------
  // CONSTS
  // ---------------------
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

  // ---------------------
  // STATES
  // ---------------------
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [display, setDisplay] = useState<"Day" | "Month" | null>("Month");
  const [displayData, setDisplayData] = useState<LogType[]>();

  // ---------------------
  // FUNCTIONS
  // ---------------------
  const handleOpenDay = (logs: LogType[], digit: number) => {
    setDisplay("Day");
    setDisplayData(logs);
    setSelectedDay(digit);
  };

  const handleReturnFromDay = () => {
    setDisplay("Month");
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

  // ---------------------
  // COMPONENT
  // ---------------------
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
          <View style={{ paddingTop: 10 }}>
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
    height: height * 0.58,
    width: width,
  },
  aboveMonthContainer: {
    width: width,
    paddingHorizontal: width * 0.046,
  },
  monthDisplayTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthTitle: {
    marginLeft: 6,
    marginTop: 10,
    fontSize: 26,
    paddingBottom: 10,
    fontWeight: "bold",
  },
});
