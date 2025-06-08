import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { keyExtractor } from "@/assets/functions";
import { useRouter } from "expo-router";

interface Props {
  items: EmotionType[];
  selected: number;
}

const { width, height } = Dimensions.get("window");

const DotNavigation = ({ items, selected }: Props) => {
  const router = useRouter();

  // Functions
  const handleOpenEmotion = (item: EmotionType) => {
    const params = Object.assign(item);
    // params["date"] = date;
    // params["time"] = time;
    router.push({
      pathname: "/emotionProfile",
      params: params,
    });
  };

  // @ts-expect-error
  const renderDots = ({ item, index }) => {
    if (index == selected) {
      return (
        <TouchableOpacity
        style={{
          padding: 8,
          borderRadius: 30,
          backgroundColor: item.color,
          width: width * 0.46,
          height: height * 0.07,
        justifyContent: "center",
      }}
      onPress={() => handleOpenEmotion(item)}
    >
      <Text style={{ fontSize: 22, textAlign: "center" }}>
        {item.name}
      </Text>
    </TouchableOpacity>
      )
    } else {
      let dotSize = 0;
      if (index == selected + 1 || index == selected - 1) {
        dotSize = width * 0.03;
      } else if (index == selected + 2 || index == selected - 2) {
        dotSize = width * 0.022;
      } else {
        dotSize = width * 0.016;
      }

      return (
        <View
        style={{
          width: dotSize,
          height: dotSize,
          //   borderWidth: index == selected ? 1 : 0,
          borderColor: "rgba(0,0,0,0.1)",
          borderRadius: 999,
          backgroundColor: item.color,
        }}
        />
      )
    }
  };

  return (
    <FlatList
      scrollEnabled={false}
      horizontal
      contentContainerStyle={{
        // borderWidth: 1,
        width: width,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        // height: height * 0.1,
      }}
      data={items}
      renderItem={renderDots}
      keyExtractor={keyExtractor}
    />
  );
};

export default DotNavigation;

const styles = StyleSheet.create({});
