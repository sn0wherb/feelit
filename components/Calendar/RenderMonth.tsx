import { Dimensions, StyleSheet, FlatList } from "react-native";
import React, { memo } from "react";
import RenderDay from "./RenderDay";
import { keyExtractor } from "@/assets/functions";

interface Props {
  data: Date[];
  passOpenDay: (data: LogType[], digit: number) => void;
}

const { width, height } = Dimensions.get("window");

const RenderMonth = ({ data, passOpenDay }: Props) => {
  // @ts-expect-error
  const renderDay = ({ item, index }) => {
    // Get the date digit
    const dateDigit: number = Number(
      item.toLocaleDateString("default", {
        day: "numeric",
      })
    );

    // Days in previous or next month
    if ((index < 7 && dateDigit > 7) || (index > 20 && dateDigit < 7)) {
      return (
        <RenderDay
          digit={dateDigit}
          fullDate={item}
          bounds={"outside"}
          passOpenDay={passOpenDay}
        />
      );
    }
    // Days in this month
    return (
      <RenderDay
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

export default memo(RenderMonth);

const styles = StyleSheet.create({
  dayContainer: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
});
