import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import EmotionDisplay from "@/components/EmotionDisplay";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import SuccessScreen from "@/components/SuccessScreen";
import Controls from "@/components/Controls";

type EmotionType = {
  id: number;
  name: string;
  parent: string | null;
  color: string;
  level: number;
  isCustom: number;
};

type DiaryType = {
  root: string | undefined;
  need: string | undefined;
  extra: string | undefined;
};

type StrokeType = [string[], string, number];

const { width, height } = Dimensions.get("window");

export default function logNewEmotion() {
  // STATES
  const [level, setLevel] = useState<number>(1);
  const [emotionStack, setEmotionStack] = useState<EmotionType[]>([]);
  const [data, setData] = useState<EmotionType[]>([]);
  const [bodyDrawingData, setBodyDrawingData] = useState<
    StrokeType[] | undefined
  >(undefined);
  const [diaryData, setDiaryData] = useState<DiaryType | undefined>(undefined);
  const [refresh, setRefresh] = useState(0);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);

  // CONSTANTS
  const {
    stockEmotionData,
  } = require("./../assets/data/emotions/stockEmotionData.ts");
  const { queries } = require("./../assets/SQL/queries.ts");
  const db = useSQLiteContext();
  const router = useRouter();
  const currentEmotion = emotionStack[emotionStack.length - 1];

  // EFFECTS
  useEffect(() => {
    if (level === 1) {
      setEmotionStack([]);
    } else if (level > 3) {
      return;
    }
  }, [level]);

  useFocusEffect(
    useCallback(() => {
      // if (level === 6) {
      //   setLevel(1);
      // }
      getData();
    }, [level, refresh])
  );

  // FUNCTIONS
  // Fetch all emotions in the current level, if level is higher than 1 then fetch all emotions in current level with current parent
  const getData = async () => {
    if (level > 1 && currentEmotion) {
      // Get stock emotions
      const stockData: EmotionType[] = Object.values(
        stockEmotionData[level][currentEmotion.name] || {}
      );
      // Get user created emotions
      const customData = await db.getAllAsync<EmotionType>(
        `SELECT * FROM user_created_emotions WHERE parent = ?`,
        [currentEmotion.name]
      );

      // Add user created emotions to stock emotions
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
        if ((bodyDrawingData && bodyDrawingData.length > 1) || diaryData) {
          Alert.alert("Discard?", "Any changes you've made will be lost.", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Discard",
              onPress: () => {
                setLevel(emotionLevel == 3 ? emotionLevel : emotionLevel + 1);
                setEmotionStack(emotionStack.slice(0, -1));
                setBodyDrawingData(undefined);
                setDiaryData(undefined);
              },
              style: "destructive",
            },
          ]);
          return;
        } else {
          setLevel(emotionLevel == 3 ? emotionLevel : emotionLevel + 1);
        }
      } else if (level == 5) {
        setLevel(4);
      } else {
        setLevel(emotionLevel);
      }
      setEmotionStack(emotionStack.slice(0, -1)); // Remove last inserted currentEmotion from emotion history
    } else {
      // Going back on first level exits log creation
      router.back();
    }
  };

  const handleSave = () => {
    setLevel(4);
    setEmotionStack([...emotionStack, currentEmotion]);
  };

  // Clicking on an emotion
  const handleClickEmotion = (item: EmotionType, svgData?: StrokeType[]) => {
    if (level === 4 && svgData && svgData.length > 1) {
      setBodyDrawingData(svgData);
    }
    setLevel(level + 1);
    setEmotionStack([...emotionStack, item]);
  };

  const handleCreateLog = async () => {
    try {
      // Save log to sql db
      await db.runAsync(
        "INSERT INTO emotion_logs (emotion, color, root, need, extra) VALUES (?,?,?,?,?);",
        [
          currentEmotion.name,
          currentEmotion.color,
          diaryData?.root ? diaryData?.root : "",
          diaryData?.need ? diaryData?.need : "",
          diaryData?.extra ? diaryData?.extra : "",
        ]
      );
      // Convert bodydrawing to sql-friendly data and store it in a separate table with a foreign key to this log
      const thisLogId = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM emotion_logs WHERE id = (SELECT MAX(id) FROM emotion_logs);"
      );
      const query = generateSvgEntry(Number(thisLogId?.id));
      query && (await db.runAsync(query));
      setLevel(level + 1);
      setTimeout(() => {
        setLevel(1);
        router.replace("/(tabs)/feed");
      }, 1600);
    } catch (e) {
      console.error(e);
    }
  };

  const generateSvgEntry = (id: number) => {
    let query = `INSERT INTO bodydrawing_svg_paths (id, path, color, size) VALUES `;
    if (bodyDrawingData && bodyDrawingData.length > 1) {
      bodyDrawingData.shift();
      bodyDrawingData.forEach((value, index) => {
        const paths = value[0].join("/");

        if (index == bodyDrawingData.length - 1) {
          query += `(${id}, '${paths}', '${value[1]}', ${value[2]});`;
        } else {
          query += `(${id}, '${paths}', '${value[1]}', ${value[2]}), `;
        }
      });
      return query;
    } else {
      return false;
    }
  };

  const updateBodyDrawingData = (data: StrokeType[]) => {
    setBodyDrawingData(data);
  };

  const updateDiaryData = (field: string, data: string) => {
    switch (field) {
      case "root":
        setDiaryData({
          root: data,
          need: diaryData?.need,
          extra: diaryData?.extra,
        });
        break;
      case "need":
        setDiaryData({
          root: diaryData?.root,
          need: data,
          extra: diaryData?.extra,
        });
        break;
      case "extra":
        setDiaryData({
          root: diaryData?.root,
          need: diaryData?.need,
          extra: data,
        });
        break;
      default:
        break;
    }
  };

  const handleToggleEditing = (state: boolean) => {
    setIsEditingEnabled(state);
  };
  console.log(level);

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
            <Header
              level={level}
              handleGoBack={handleGoBack}
              name={currentEmotion ? currentEmotion.name : ""}
              color={currentEmotion ? currentEmotion.color : ""}
              isEditingEnabled={isEditingEnabled}
            />

            <EmotionDisplay
              level={level}
              currentEmotion={currentEmotion}
              data={data}
              bodyDrawingData={bodyDrawingData}
              passBodyDrawingData={updateBodyDrawingData}
              diaryData={diaryData}
              passDiaryData={updateDiaryData}
              passHandleClickEmotion={handleClickEmotion}
              handleCreateLog={handleCreateLog}
              isEditingEnabled={isEditingEnabled}
              toggleEditing={handleToggleEditing}
              refresh={() => {
                setRefresh((refresh) => refresh + 1);
              }}
            />
            <Controls
              level={level}
              handleGoBack={handleGoBack}
              handleSave={handleSave}
              name={currentEmotion ? currentEmotion.name : ""}
              color={currentEmotion ? currentEmotion.color : ""}
              toggleEditing={handleToggleEditing}
              isEditingEnabled={isEditingEnabled}
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
});
