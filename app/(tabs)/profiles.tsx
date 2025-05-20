import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import Feather from "@expo/vector-icons/Feather";
import EmotionDropdown from "@/components/EmotionDropdown";
import { keyExtractor } from "@/assets/functions";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

type EmotionType = {
  id: number;
  name: string;
  parent: string | null;
  color: string;
  level: number;
  isCustom: number;
};

const { width, height } = Dimensions.get("window");

const profiles = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const [emotions, setEmotions] = useState<EmotionType[]>([]);

  const {
    stockEmotionData,
  } = require("@/assets/data/emotions/stockEmotionData");

  // Functions
  const getEmotions = async () => {
    try {
      const data = await db.getAllAsync<EmotionType>(
        "SELECT * FROM user_created_emotions"
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
    return <View></View>;
  };

  useEffect(() => {
    getEmotions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <View>
        <Text
          style={{
            fontSize: 40,
            marginTop: 20,
            marginLeft: 20,
          }}
        >
          Emotion profiles
        </Text>
      </View> */}
      {/* Search */}
      <View>
        <TextInput
          placeholder="Search emotions"
          placeholderTextColor="#555"
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 16,
            padding: 8,
            margin: 10,
            fontSize: 20,
          }}
        />
      </View>
      {/* Emotions */}
      <FlatList
        data={emotions}
        renderItem={renderEmotions}
        keyExtractor={keyExtractor}
      />
      <View style={{ width: width, padding: 10 }}>
        {/* <View>
        <Text style={{ fontSize: 40, color: "#6b5a2c" }}>Days of the week</Text>
        <Text style={{ fontSize: 40, color: "#6b5a2c" }}>Times of the day</Text>
        <Text style={{ fontSize: 40, color: "#6b5a2c" }}>
          Each emotion profile: Most common cause Most common need Body map
        </Text>
      </View> */}
      </View>
    </SafeAreaView>
  );
};

export default profiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "beige",
  },
});
