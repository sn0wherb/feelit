import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import Feather from "@expo/vector-icons/Feather";
import EmotionDropdown from "@/components/Profiles/EmotionDropdown";
import { keyExtractor } from "@/assets/functions";
import BodyDisplay from "@/components/BodyDrawing/BodyDisplay";
import EmotionDropdown2 from "@/components/Profiles/EmotionDropdown2";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import DotNavigation from "@/components/Profiles/DotNavigation";
import BodyDataCompilation from "@/components/BodyDrawing/BodyDataCompilation";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

const { width, height } = Dimensions.get("window");

const profiles = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const [emotions, setEmotions] = useState<EmotionType[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState(0);
  const [isOptionsDropdownVisible, setIsOptionsDropdownVisible] =
    useState(false);

  const {
    stockEmotionData,
  } = require("@/assets/data/emotions/stockEmotionData");
  const bodyHeight = 0.74;

  // Functions
  const getEmotions = async () => {
    try {
      const data = await db.getAllAsync<EmotionType>(
        "SELECT * FROM user_created_emotions WHERE parent IS NULL"
      );
      const allEmotions: EmotionType[] = Object.values(stockEmotionData[1]);
      data.forEach((emotion) => {
        allEmotions.push(emotion);
      });
      setEmotions(allEmotions);
    } catch (e) {
      console.error(e);
    }
  };

  // @ts-expect-error
  const renderEmotions = ({ item, index }) => {
    return <EmotionDropdown emotion={item} />;
  };

  // @ts-expect-error
  const renderBodies = ({ item, index }) => {
    return (
      <View style={{ width: width }}>
        <BodyDataCompilation size={bodyHeight} emotion={item} />
        {/* <View style={{ width: width, alignItems: "center" }}>
          <EmotionDropdown2 emotion={item} />
        </View> */}
      </View>
    );
  };

  useEffect(() => {
    getEmotions();
  }, []);

  const bodyRef = useRef<FlatList>(null);

  // @ts-expect-error
  const handleViewableItemsChanged = ({ viewableItems }) => {
    setSelectedEmotion(viewableItems[0].index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top */}
      <View style={{ width: width, justifyContent: "center", display: "none" }}>
        <View
          style={{
            flexDirection: "row",
            width: width,
            margin: 10,
            marginBottom: 0,
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Options */}
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              padding: 8,
              borderRadius: 16,
            }}
            onPress={() => {
              setIsOptionsDropdownVisible(!isOptionsDropdownVisible);
            }}
          >
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
          {/* Options dropdown */}
          {isOptionsDropdownVisible && (
            <View style={styles.optionsDropdown}>
              <TouchableOpacity onPress={() => {}} style={styles.optionItem}>
                <Text style={{ fontSize: 18 }}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.optionItem}>
                <Text style={{ fontSize: 18 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Search */}
          <TextInput
            placeholder="Search emotions"
            placeholderTextColor="#555"
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: 16,
              padding: 8,
              fontSize: 20,
              width: width * 0.8,
            }}
          />
        </View>
      </View>
      {/* Emotions */}
      <View>
        <FlatList
          contentContainerStyle={{ marginTop: 20 }}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          data={emotions}
          renderItem={renderBodies}
          keyExtractor={keyExtractor}
          ref={bodyRef}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          onViewableItemsChanged={handleViewableItemsChanged}
        />
        {/* Dots */}
        <View style={{ marginTop: 4 }}>
          <DotNavigation items={emotions} selected={selectedEmotion} />
        </View>
      </View>
      {/* Notes */}
      {/* <View style={{ width: width, padding: 10 }}>
        <View>
        <Text style={{ fontSize: 40, color: "#6b5a2c" }}>Days of the week</Text>
        <Text style={{ fontSize: 40, color: "#6b5a2c" }}>Times of the day</Text>
        <Text style={{ fontSize: 40, color: "#6b5a2c" }}>
          Each emotion profile: Most common cause Most common need Body map
        </Text>
      </View>
      </View> */}
    </SafeAreaView>
  );
};

export default profiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "beige",
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
    // borderColor: "rgba(0,0,0,0.3)",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
