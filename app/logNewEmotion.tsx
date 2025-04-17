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
  level: number;
};

const { width, height } = Dimensions.get("window");

export default function logNewEmotion() {
  const [level, setLevel] = useState<number>(1),
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

  // Fetch all emotions in the current level, if level is higher than 1 then fetch all emotions in current level with current parent
  const getData = async () => {
    if (level > 1 && currentEmotion) {
      const stockData: EmotionType[] = Object.values(
        stockEmotionData[level][currentEmotion.name] || {}
      );

      // TO-DO: fix dis
      const customData = await db.getAllAsync<EmotionType>(
        `SELECT * FROM user_created_emotions WHERE parent = ?`,
        [currentEmotion.name]
      );

      customData.forEach((value) => {
        stockData.push(value);
      });

      setData(stockData);
    } else {
      const stockData: EmotionType[] = Object.values(
        stockEmotionData[level] || {}
      );
      const customData = await db.getAllAsync<EmotionType>(
        `SELECT * FROM user_created_emotions WHERE parent IS NULL`
      );

      customData.forEach((value) => {
        stockData.push(value);
      });

      setData(stockData);
    }
  };

  const handleGoBack = () => {
    if (level !== 1) {
      const emotionLevel = emotionStack[emotionStack.length - 1].level;
      if (level === 4) {
        setLevel(emotionLevel == 3 ? emotionLevel : emotionLevel + 1);
      } else if (level == 5) {
        setLevel(4);
      } else {
        setLevel(emotionLevel);
      }
      setEmotionStack(emotionStack.slice(0, -1)); // Remove last inserted currentEmotion
    } else {
      // Going back on first level exits log creation
      router.back();
    }
  };

  const handleSave = () => {
    // TO-DO: fix going back after this
<<<<<<< HEAD
    setLevel(4);
=======
    // could put level inside of every emotion and then set it upon reading it
    setLevel(4);
    setEmotionStack([...emotionStack, currentEmotion]);
>>>>>>> 9f9ee28de9f3d860fcb80ba6258e4f446318ae9a
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

  console.log(emotionStack, level);

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
                handleSave={handleSave}
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
