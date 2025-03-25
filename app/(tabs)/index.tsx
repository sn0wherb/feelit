import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import EmotionDisplay from "@/components/EmotionDisplay";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";

type EmotionType = {
  name: string;
  parent: string | null;
  color: string;
};

export default function App() {
  const [level, setLevel] = useState(1),
    // [emotion, setEmotion] = useState<EmotionType>(),
    [emotionStack, setEmotionStack] = useState<EmotionType[]>([]),
    [data, setData] = useState<EmotionType[]>([]);
  const {
    emotionData,
  } = require("../../assets/data/emotions/stockEmotionData.ts");
  const { queries } = require("../../assets/SQL/queries.ts");
  const currentEmotion = emotionStack[emotionStack.length - 1];

  const db = useSQLiteContext();

  useEffect(() => {
    if (level === 1) {
      setEmotionStack([]);
    } else if (level > 3) {
      return;
    }
    getData();
  }, [level]);

  useFocusEffect(
    useCallback(() => {
      if (level === 5) {
        setLevel(0);
      }
    }, [])
  );

  // Fetch all emotions in the current level and with the chosen parent
  const getData = () => {
    if (level > 1 && currentEmotion) {
      setData(Object.values(emotionData[level][currentEmotion.name] || {})); // Convert object to array and set it as data
    } else {
      setData(Object.values(emotionData[level] || {}));
    }
  };

  const handleGoBack = () => {
    setLevel(level - 1);
    setEmotionStack(emotionStack.slice(0, -1)); // Remove last inserted currentEmotion
  };

  const handleButtonClick = (item: EmotionType) => {
    setLevel(level + 1);
    setEmotionStack([...emotionStack, item]);
  };

  const handleCreateLog = async (entries: string[]) => {
    try {
      await db.runAsync(
        "INSERT INTO emotion_logs (emotion, color, root, need, extra) VALUES (?,?,?,?,?);",
        [
          currentEmotion.name,
          currentEmotion.color,
          entries[0],
          entries[1],
          entries[2],
        ]
      );
      setLevel(level + 1);
      setTimeout(() => {
        setLevel(1);
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <LinearGradient colors={["beige", "beige"]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {level === 5 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Text style={{ fontSize: 24 }}>Saved successfully!</Text>
            <Ionicons name="checkmark-circle" size={56} color="black" />
          </View>
        ) : (
          <View>
            <Header
              level={level}
              handleGoBack={handleGoBack}
              name={currentEmotion ? currentEmotion.name : ""}
              color={currentEmotion ? currentEmotion.color : ""}
            />

            <EmotionDisplay
              level={level}
              currentEmotion={currentEmotion}
              data={data}
              passHandleButtonClickToParent={handleButtonClick}
              handleCreateLog={handleCreateLog}
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  block: {
    height: 70,
  },
});
