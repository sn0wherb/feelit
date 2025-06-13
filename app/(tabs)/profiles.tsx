import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { keyExtractor } from "@/assets/functions";
import DotNavigation from "@/components/Profiles/DotNavigation";
import ProfileSlide from "@/components/BodyDrawing/ProfileSlide";

const { width, height } = Dimensions.get("window");

const profiles = () => {
  // ---------------------
  // CONSTS
  // ---------------------
  const { stockEmotionData } = require("@/assets/stockEmotionData");

  // ---------------------
  // STATES
  // ---------------------
  const db = useSQLiteContext();
  const [emotions, setEmotions] = useState<EmotionType[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState(0);

  // ---------------------
  // REFS
  // ---------------------
  const bodyRef = useRef<FlatList>(null);

  // ---------------------
  // FUNCTIONS
  // ---------------------
  const getAllBaseEmotions = async () => {
    try {
      const data = await db.getAllAsync<EmotionType>(
        "SELECT * FROM user_created_emotions WHERE parent IS NULL"
      );
      const allEmotions: EmotionType[] = [...stockEmotionData[1]];
      data.forEach((emotion) => {
        allEmotions.push(emotion);
      });
      setEmotions(allEmotions);
    } catch (e) {
      console.error(e);
    }
  };

  const renderProfileSlide = ({ item }: { item: EmotionType }) => {
    return (
      <View style={{ width: width }}>
        <ProfileSlide emotion={item} />
      </View>
    );
  };

  const handleViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    viewableItems[0].index && setSelectedEmotion(viewableItems[0].index);
  };

  // ---------------------
  // EFFECTS
  // ---------------------
  useEffect(() => {
    getAllBaseEmotions();
  }, []);

  // ---------------------
  // COMPONENT
  // ---------------------
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Dots */}
        <DotNavigation items={emotions} selected={selectedEmotion} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{}}
          horizontal
          pagingEnabled
          data={emotions}
          renderItem={renderProfileSlide}
          keyExtractor={keyExtractor}
          ref={bodyRef}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          onViewableItemsChanged={handleViewableItemsChanged}
        />
      </SafeAreaView>
    </View>
  );
};

export default profiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "beige",
    height: height,
    width: width,
  },
  contentContainer: {
    flex: 1,
  },
  optionsDropdown: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    top: height * 0.08,
    left: 0,
    gap: 20,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 12,
    paddingRight: 20,
    width: width * 0.4,
    height: height * 0.2,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
