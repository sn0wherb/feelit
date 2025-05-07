import { Dimensions, StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import Day from "./Day";

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
  data: Date[];
  passOpenDay: (data: LogType[]) => void;
}

const { width, height } = Dimensions.get("window");

const DaysInMonth = ({ data, passOpenDay }: Props) => {
  const keyExtractor = (index: any) => "key-" + index.toString();

  // @ts-expect-error
  const renderDay = ({ item, index }) => {
    const dateDigit: number = Number(
      item.toLocaleDateString("default", {
        day: "numeric",
      })
    );

    // Days in previous or next month
    if ((index < 7 && dateDigit > 7) || (index > 20 && dateDigit < 7)) {
      return (
        <Day
          digit={dateDigit}
          fullDate={item}
          bounds={"outside"}
          passOpenDay={passOpenDay}
        />
      );
    }
    // Days in this month
    return (
      <Day
        digit={dateDigit}
        fullDate={item}
        bounds={"inside"}
        passOpenDay={passOpenDay}
      />
    );
  };

  return (
    // Days
    <FlatList
      scrollEnabled={false}
      contentContainerStyle={styles.dayContainer}
      numColumns={7}
      data={data}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      getItemLayout={(_item, index) => ({
        length: width * 0.12 + 2,
        offset: width * 0.12 + 2 * index,
        index,
      })}
      renderItem={renderDay}
    />
  );
};

export default DaysInMonth;

const styles = StyleSheet.create({
  dayContainer: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    // padding: width * 0.02,
    // flex: 1,
    // borderWidth: 2,
  },
});
