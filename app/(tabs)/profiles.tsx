import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import Feather from "@expo/vector-icons/Feather";
import EmotionDropdown from "@/components/Profiles/EmotionDropdown";
import { keyExtractor, uncapitalise } from "@/assets/functions";
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

type AnalyticsType = {
  emotion: EmotionType;
  frequency: number;
  people: SelectionType[];
  places: SelectionType[];
};

const profiles = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const [emotions, setEmotions] = useState<EmotionType[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState(0);
  const [isOptionsDropdownVisible, setIsOptionsDropdownVisible] =
    useState(false);
  const [level, setLevel] = useState(1);
  const [logData, setLogData] = useState<LogType[]>([]);
  const [commonPeople, setCommonPeople] = useState<SelectionType[]>([]);
  const [commonPlaces, setCommonPlaces] = useState<SelectionType[]>([]);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsType[]>([]);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  const {
    stockEmotionData,
  } = require("@/assets/data/emotions/stockEmotionData");
  const bodyHeight = 0.74;

  // Flow:
  // 1. Get all base emotions
  // 2. Pass each emotion to BodyDataCompilation
  // 3. BodyDataCompilation returns all log data under each base emotion
  // 4. From this data we create analyticsData

  // Functions
  const getAllBaseEmotions = async () => {
    try {
      const data = await db.getAllAsync<EmotionType>(
        "SELECT * FROM user_created_emotions WHERE parent IS NULL"
      );
      const allEmotions: EmotionType[] = Object.values(stockEmotionData[1]);
      data.forEach((emotion) => {
        allEmotions.push(emotion);
      });
      setEmotions(allEmotions);
      console.log(allEmotions);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectEmotion = (emotion: EmotionType, level: number) => {
    // setSelectedEmotion(emotion);
    // setLevel(level);
  };

  const handleSetLogData = (data: LogType[]) => {
    setLogData(data);
    getCommonPeople(data);
    // getTopSelectableData(data, "place");
  };

  const renderBodies = ({
    item,
    index,
  }: {
    item: EmotionType;
    index: number;
  }) => {
    let analytics = {
      emotion: item,
      frequency: 0,
      people: commonPeople,
      places: commonPlaces,
    };

    useEffect(() => {
      setAnalyticsData([...analyticsData, analytics]);
    }, []);

    // setData(analytics);

    return (
      <View style={{ width: width }}>
        {/* Body */}
        <BodyDataCompilation
          size={bodyHeight}
          emotion={item}
          setLogData={handleSetLogData}
        />
      </View>
    );
  };

  const setData = (data: AnalyticsType) => {
    setAnalyticsData([...analyticsData, data]);
  };

  useEffect(() => {
    getAllBaseEmotions();
  }, []);

  // useEffect(() => {
  //   if (analyticsData.length === emotions.length) {
  //     setIsAnalyticsLoading(false);
  //   }
  // }, [analyticsData]);

  const bodyRef = useRef<FlatList>(null);

  // @ts-expect-error
  const handleViewableItemsChanged = ({ viewableItems }) => {
    setSelectedEmotion(viewableItems[0].index);
  };

  const getCommonPeople = async (data: LogType[]) => {
    try {
      // Create an array to store person counts
      const personCounts: { person: number; count: number }[] = [];

      // For each log in logData
      for (const log of data) {
        // Get associated people from emotion_log_people table
        const associatedPeople = await db.getAllAsync<{ person_id: number }>(
          `SELECT person_id FROM emotion_log_people WHERE log_id = ${log.id}`
        );

        // For each associated person
        for (const { person_id } of associatedPeople) {
          // Find if this person already exists in our counts array
          const existingPerson = personCounts.find(
            (p) => p.person === person_id
          );

          if (existingPerson) {
            // If person exists, increment their count
            existingPerson.count++;
          } else {
            // If person doesn't exist, add them with count 1
            personCounts.push({ person: person_id, count: 1 });
          }
        }
      }

      // Sort by count in descending order
      personCounts.sort((a, b) => b.count - a.count);

      // Get the actual person data for the top results
      const topPeople = (
        await Promise.all(
          personCounts.slice(0, 5).map(async ({ person }) => {
            const personData = await db.getFirstAsync<SelectionType>(
              `SELECT * FROM people WHERE id = ${person}`
            );
            return personData;
          })
        )
      ).filter((person): person is SelectionType => person !== null);

      setCommonPeople(topPeople);
      // console.log(topPeople);
      // console.log(topPeople);
    } catch (e) {
      console.error("Error getting common people:", e);
    }
  };

  // const getTopSelectableData = async (
  //   data: LogType[],
  //   type: "person" | "place"
  // ) => {
  //   try {
  //     // Create an array to store person counts
  //     const selectableCounts: { selectable: number; count: number }[] = [];

  //     // For each log in logData
  //     for (const log of data) {
  //       // Get associated people from emotion_log_people table
  //       const associatedSelectables = await db.getAllAsync<{
  //         selectable_id: number;
  //       }>(`SELECT person_id FROM emotion_log_people WHERE log_id = ${log.id}`);

  //       console.log(associatedSelectables);

  //       // For each associated person
  //       for (const { selectable_id } of associatedSelectables) {
  //         // Find if this person already exists in our counts array
  //         const existingSelectable = selectableCounts.find(
  //           (s) => s.selectable === selectable_id
  //         );

  //         if (existingSelectable) {
  //           // If person exists, increment their count
  //           existingSelectable.count++;
  //         } else {
  //           // If person doesn't exist, add them with count 1
  //           selectableCounts.push({ selectable: selectable_id, count: 1 });
  //         }
  //       }
  //     }

  //     // Sort by count in descending order
  //     selectableCounts.sort((a, b) => b.count - a.count);

  //     // Get the actual person data for the top results
  //     const topSelectables = (
  //       await Promise.all(
  //         selectableCounts.slice(0, 5).map(async ({ selectable }) => {
  //           const selectableData = await db.getFirstAsync<SelectionType>(
  //             `SELECT * FROM people WHERE id = ${selectable}`
  //           );
  //           return selectableData;
  //         })
  //       )
  //     ).filter(
  //       (selectable): selectable is SelectionType => selectable !== null
  //     );

  //     // type === "person"
  //     //   ? setCommonPeople(topSelectables)
  //     //   : setCommonPlaces(topSelectables);
  //     // console.log(topPeople);
  //   } catch (e) {
  //     console.error(
  //       `Error getting common ${type === "person" ? "people" : "places"}:`,
  //       e
  //     );
  //   }
  // };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Dots */}
        <DotNavigation
          items={emotions}
          selected={selectedEmotion}
          level={level}
          selectEmotion={handleSelectEmotion}
        />
        <ScrollView style={{}}>
          {/* Emotions */}
          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{}}
            horizontal
            pagingEnabled
            data={emotions}
            renderItem={renderBodies}
            keyExtractor={keyExtractor}
            ref={bodyRef}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            onViewableItemsChanged={handleViewableItemsChanged}
          />
          {/* Analytics */}
          <View style={{ gap: 12, paddingBottom: 50 }}>
            {/* This would take a lot of word processing */}
            {/* <View style={styles.section}>
            <Text style={styles.title}>Most common cause</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Most common need</Text>
          </View> */}
            {isAnalyticsLoading ? (
              <ActivityIndicator />
            ) : (
              <View>
                {/* Time saturation */}
                <View style={styles.section}>
                  <Text style={styles.title}>
                    When you feel most{" "}
                    {uncapitalise(analyticsData[selectedEmotion].emotion.name)}
                  </Text>
                </View>
                {/* People */}
                <View style={styles.section}>
                  <Text style={styles.title}>
                    {/* People you feel {uncapitalise(emotions[selectedEmotion].name)}{" "} */}
                    with
                  </Text>
                  <FlatList
                    data={commonPeople}
                    contentContainerStyle={{
                      gap: 10,
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          backgroundColor: item.color,
                          padding: 10,
                          borderRadius: 20,
                        }}
                      >
                        <Text>{item.name}</Text>
                      </View>
                    )}
                    keyExtractor={keyExtractor}
                  />
                </View>
                {/* Places */}
                <View style={styles.section}>
                  <Text style={styles.title}>
                    {/* Places you feel {uncapitalise(emotions[selectedEmotion].name)}{" "} */}
                    at
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
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
    // borderColor: "rgba(0,0,0,0.3)",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  section: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    paddingVertical: 12,
  },
});
