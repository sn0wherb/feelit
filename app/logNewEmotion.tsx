import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import EmotionDisplay from "@/components/EmotionDisplay";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import SuccessScreen from "@/components/SuccessScreen";

type EmotionType = {
  name: string;
  parent: string | null;
  color: string;
};

const { width, height } = Dimensions.get("window");

export default function logNewEmotion() {
  const [level, setLevel] = useState(1),
    [emotionStack, setEmotionStack] = useState<EmotionType[]>([]),
    [data, setData] = useState<EmotionType[]>([]);

  const {
    stockEmotionData,
  } = require("./../assets/data/emotions/stockEmotionData.ts");

  const { queries } = require("./../assets/SQL/queries.ts");
  const currentEmotion = emotionStack[emotionStack.length - 1];

  const db = useSQLiteContext();
  const router = useRouter();

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
      if (level === 6) {
        setLevel(0);
      }
    }, [])
  );

  // Fetch all emotions in the current level under current parent if level isn't 1
  const getData = async () => {
    if (level > 1 && currentEmotion) {
      setData(
        Object.values(stockEmotionData[level][currentEmotion.name] || {})
      ); // Convert object to array and set it as data
    } else {
      // const customEmotionData = await db.getAllAsync("SELECT * FROM user_created_emotions WHERE parent = NULL");
      // const stockEmotionData = Object.values(stockEmotionData[level] || {});
      // const combinedData = stockEmotionData.push(customEmotionData);
      setData(Object.values(stockEmotionData[level] || {}));
    }
  };

  const handleGoBack = () => {
    if (level !== 1) {
      setLevel(level - 1);
      setEmotionStack(emotionStack.slice(0, -1)); // Remove last inserted currentEmotion
    } else {
      router.back();
      // router.replace("/(tabs)/overview");
      // return <Redirect href={"/(tabs)/overview"} />; // doesn't work for some reason?
    }
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
        router.replace("/(tabs)/overview");
      }, 1600);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "beige" }]}>
      <SafeAreaView style={styles.container}>
        {level === 6 ? (
          <SuccessScreen />
        ) : (
          <View
            style={{
              width: width,
              height: height,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Header
                level={level}
                handleGoBack={handleGoBack}
                name={currentEmotion ? currentEmotion.name : ""}
                color={currentEmotion ? currentEmotion.color : ""}
              />
            </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: width,
  },
  block: {
    height: 70,
  },
});
