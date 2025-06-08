import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { keyExtractor } from "@/assets/functions";
import { useRouter } from "expo-router";
import { stockEmotionData } from "@/assets/data/emotions/stockEmotionData";
import { useSQLiteContext } from "expo-sqlite";

interface Props {
  items: EmotionType[];
  selected: number;
  level: number;
  selectEmotion: (emotion: EmotionType, level: number) => void;
}

const { width, height } = Dimensions.get("window");

const DotNavigation = ({ items, selected, level, selectEmotion }: Props) => {
  const router = useRouter();
  const [isEmotionSelectionVisible, setIsEmotionSelectionVisible] =
    useState(false);
  const [childrenEmotions, setChildrenEmotions] = useState<EmotionType[]>([]);
  const db = useSQLiteContext();

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

  const toggleOpenEmotionSelection = () => {
    setIsEmotionSelectionVisible(!isEmotionSelectionVisible);
    getChildrenEmotions(items[selected]);
  };

  const getCustomChildrenEmotions = async (emotion: EmotionType) => {
    try {
      const data = await db.getAllAsync<EmotionType>(
        `SELECT * FROM emotions WHERE parent = '${emotion.name}'`
      );
      if (data.length > 0) {
        data.forEach((value) => {
          return getCustomChildrenEmotions(value);
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getChildrenEmotions = (emotion: EmotionType) => {
    if (emotion.isCustom) {
      return getCustomChildrenEmotions(emotion);
    }

    let children: EmotionType[] = [];

    if (level === 1) {
      const secondLvl: EmotionType[] = Object.values(
        stockEmotionData[2][emotion.name]
      );
      secondLvl.forEach((secondLvlEmotion) => {
        children.push(secondLvlEmotion);
      });
    } else {
      const thirdLvl: EmotionType[] = Object.values(
        stockEmotionData[3][emotion.name]
      );
      thirdLvl.forEach((thirdLvlEmotion) => {
        children.push(thirdLvlEmotion);
      });
    }
    setChildrenEmotions(children);
  };

  const renderDots = ({
    item,
    index,
  }: {
    item: EmotionType;
    index: number;
  }) => {
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
          onPress={toggleOpenEmotionSelection}
        >
          <Text style={{ fontSize: 22, textAlign: "center" }}>{item.name}</Text>
        </TouchableOpacity>
      );
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
      );
    }
  };

  const renderChildrenEmotions = ({
    item,
    index,
  }: {
    item: EmotionType;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        style={{
          padding: 8,
          borderRadius: 30,
          backgroundColor: item.color,
          // width: width * 0.46,
          // height: height * 0.07,
          justifyContent: "center",
        }}
        onPress={() => selectEmotion(item, item.level)}
      >
        <Text style={{ fontSize: 18, textAlign: "center" }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ position: "absolute", zIndex: 1, top: height * 0.02 }}>
      <FlatList
        scrollEnabled={false}
        horizontal
        contentContainerStyle={{
          width: width,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
        data={items}
        renderItem={renderDots}
        keyExtractor={keyExtractor}
      />
      {isEmotionSelectionVisible && (
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            top: height * 0.09,
            left: width * 0.12,
            width: width * 0.76,
            backgroundColor: "#e3d7b7",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <FlatList
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
            data={childrenEmotions}
            renderItem={renderChildrenEmotions}
            keyExtractor={keyExtractor}
          />
        </View>
      )}
    </View>
  );
};

export default DotNavigation;

const styles = StyleSheet.create({});
