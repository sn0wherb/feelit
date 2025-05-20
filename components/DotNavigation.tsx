import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { keyExtractor } from "@/assets/functions";

type EmotionType = {
  id: number;
  name: string;
  parent: string | null;
  color: string;
  level: number;
  isCustom: number;
};

interface Props {
  items: EmotionType[];
  selected?: number;
}

const { width, height } = Dimensions.get("window");

const DotNavigation = ({ items, selected }: Props) => {
  // Functions
  // @ts-expect-error
  const renderDots = ({ item, index }) => {
    return (
      <View
        style={{
          width: index == selected ? width * 0.036 : width * 0.02,
          height: index == selected ? width * 0.036 : width * 0.02,
          //   borderWidth: index == selected ? 1 : 0,
          borderColor: "rgba(0,0,0,0.1)",
          borderRadius: 999,
          backgroundColor: item.color,
        }}
      />
    );
  };

  return (
    <FlatList
      scrollEnabled={false}
      horizontal
      contentContainerStyle={{
        width: width,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
      }}
      data={items}
      renderItem={renderDots}
      keyExtractor={keyExtractor}
    />
  );
};

export default DotNavigation;

const styles = StyleSheet.create({});
