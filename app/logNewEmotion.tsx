import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import Header from "@/components/Emotion Logging/Header";
import { useFocusEffect, useRouter } from "expo-router";
import SuccessScreen from "@/components/SuccessScreen";
import Controls from "@/components/Emotion Logging/Controls";
import EmotionLoggingController from "@/components/Emotion Logging/EmotionLoggingController";
import { sortDiaryData } from "@/assets/functions";

const { width, height } = Dimensions.get("window");

export default function logNewEmotion() {
  // ---------------------
  // STATES
  // ---------------------
  const [level, setLevel] = useState<number>(1);
  const [emotionStack, setEmotionStack] = useState<EmotionType[]>([]);
  const [data, setData] = useState<EmotionType[]>([]);
  const [bodyDrawingData, setBodyDrawingData] = useState<
    StrokeType[] | undefined
  >(undefined);
  const [diaryData, setDiaryData] = useState<DiaryType | undefined>(undefined);
  const [refresh, setRefresh] = useState(0);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<SelectionType[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<SelectionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------
  // CONSTS
  // ---------------------
  const { stockEmotionData } = require("@/assets/stockEmotionData");
  const db = useSQLiteContext();
  const router = useRouter();
  const currentEmotion = emotionStack[emotionStack.length - 1];
  const [hiddenEmotions, setHiddenEmotions] = useState<string[]>([]);

  // ---------------------
  // FUNCTIONS
  // ---------------------
  // Fetch all emotions in the current level, if level is higher than 1 then fetch all emotions in current level with current parent
  const getAllEmotions = async () => {
    const hiddenEmotions: string[] = await getHiddenEmotions();
    let stockData: EmotionType[] = [];
    let customData: EmotionType[] = [];

    if (level > 1 && currentEmotion) {
      // Get stock emotions
      if (!currentEmotion.isCustom) {
        stockData = [...stockEmotionData[level][currentEmotion.name]];
      }

      // Get user created emotions
      customData = await db.getAllAsync<EmotionType>(
        `SELECT * FROM user_created_emotions WHERE parent = ?`,
        [currentEmotion.name]
      );
    } else {
      stockData = [...stockEmotionData[level]];
      customData = await db.getAllAsync<EmotionType>(
        `SELECT * FROM user_created_emotions WHERE parent IS NULL`
      );
    }

    // Add user created emotions to stock emotions
    customData.forEach((value) => {
      stockData.push(value);
    });

    // Hide hidden emotions
    stockData.forEach((value) => {
      hiddenEmotions.includes(value.name)
        ? (value.hidden = true)
        : (value.hidden = false);
    });

    setData(stockData);
    setIsLoading(false);
  };

  const getHiddenEmotions = async () => {
    const data = await db.getAllAsync<{ name: string }>(
      "SELECT * FROM hidden_emotions"
    );
    const stringData = data.map((value) => value.name);
    setHiddenEmotions(stringData);
    return stringData;
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

  const handleUpdateSelectedPeople = (people: SelectionType[]) => {
    setSelectedPeople(people);
  };

  const handleUpdateSelectedPlaces = (places: SelectionType[]) => {
    setSelectedPlaces(places);
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

      // Save selected people
      if (selectedPeople.length > 0) {
        const logId = Number(thisLogId?.id);
        const peopleQuery = `INSERT INTO emotion_log_people (log_id, person_id) VALUES ${selectedPeople
          .map((person) => `(${logId}, ${person.id})`)
          .join(", ")};`;
        await db.runAsync(peopleQuery);
      }

      // Save selected places
      if (selectedPlaces.length > 0) {
        const logId = Number(thisLogId?.id);
        const placesQuery = `INSERT INTO emotion_log_places (log_id, place_id) VALUES ${selectedPlaces
          .map((place) => `(${logId}, ${place.id})`)
          .join(", ")};`;
        await db.runAsync(placesQuery);
      }

      setLevel(level + 1);
      setTimeout(() => {
        setLevel(1);
        router.replace("/(tabs)/feed");
      }, 600);
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

  const updateDiaryData = (field: "root" | "need" | "extra", data: string) => {
    setDiaryData(sortDiaryData(field, data, diaryData));
  };

  const handleToggleEditing = (state: boolean) => {
    setIsEditingEnabled(state);
  };

  const handleToggleHideEmotion = async (name: string) => {
    let query;
    hiddenEmotions.includes(name)
      ? (query = "DELETE FROM hidden_emotions WHERE name = ?")
      : (query = "INSERT INTO hidden_emotions (name) VALUES (?)");

    try {
      await db.runAsync(query, [name]);
    } catch (e) {
      console.error(e);
    }

    setRefresh((refresh) => refresh + 1);
  };

  // ---------------------
  // EFFECTS
  // ---------------------
  useEffect(() => {
    if (level === 1) {
      setEmotionStack([]);
    }
  }, [level]);

  useFocusEffect(
    useCallback(() => {
      console.log("called");
      getAllEmotions();
    }, [level, refresh])
  );

  // ---------------------
  // COMPONENT
  // ---------------------
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

            {!isLoading && (
              <EmotionLoggingController
                level={level}
                data={data}
                currentEmotion={currentEmotion}
                passHandleClickEmotion={handleClickEmotion}
                handleCreateLog={handleCreateLog}
                bodyDrawingData={bodyDrawingData}
                passBodyDrawingData={updateBodyDrawingData}
                diaryData={diaryData}
                passDiaryData={updateDiaryData}
                isEditingEnabled={isEditingEnabled}
                passToggleEditing={handleToggleEditing}
                refresh={getAllEmotions}
                onToggleHideEmotion={handleToggleHideEmotion}
                selectedPeople={selectedPeople}
                onUpdateSelectedPeople={handleUpdateSelectedPeople}
                selectedPlaces={selectedPlaces}
                onUpdateSelectedPlaces={handleUpdateSelectedPlaces}
              />
            )}
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
