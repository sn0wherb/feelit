import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import BodyDrawing from "@/components/BodyDrawing/BodyDrawing";
import { ScrollView } from "react-native";
import BodyDisplay from "@/components/BodyDrawing/BodyDisplay";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Journal from "@/components/Emotion Logging/Journal";
import { sortDiaryData } from "@/assets/functions";

const { width, height } = Dimensions.get("window");

export default function logModal() {
  // ---------------------
  // CONSTS
  // ---------------------

  // ----------------------------
  // localSearchParams structure:
  // params["date"] = date;
  // params["time"] = time;
  // params["emotion"] = emotion;
  // params["color"] = color;
  // params["root"] = root;
  // params["need"] = need;
  // params["extra"] = extra;
  // params["id"] = id;
  // ----------------------------
  const logData = useLocalSearchParams();
  const db = useSQLiteContext();
  const router = useRouter();

  // ---------------------
  // EFFECTS
  // ---------------------
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [diaryData, setDiaryData] = useState<DiaryType>({
    root: String(logData.root),
    need: String(logData.need),
    extra: String(logData.extra),
  });
  const [newPeople, setNewPeople] = useState<SelectionType[]>([]);
  const [newPlaces, setNewPlaces] = useState<SelectionType[]>([]);

  const [isOptionsDropdownVisible, setIsOptionsDropdownVisible] =
    useState(false);

  const [logPeople, setLogPeople] = useState<SelectionType[]>([]);
  const [logPlaces, setLogPlaces] = useState<SelectionType[]>([]);
  const [originalPaths, setOriginalPaths] = useState<StrokeType[]>([
    [["M0,0"], "black", 1],
  ]);
  const [paths, setPaths] = useState<StrokeType[]>([[["M0,0"], "black", 1]]);

  // ---------------------
  // REFS
  // ---------------------
  const editingScreenRef = useRef<ScrollView>(null);

  // ---------------------
  // FUNCTIONS
  // ---------------------
  const deleteLog = () => {
    Alert.alert("Delete log?", "This log will be permanently deleted.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => confirmDeleteLog(),
        style: "destructive",
      },
    ]);
  };

  const confirmDeleteLog = async () => {
    try {
      await db.runAsync("DELETE FROM emotion_logs WHERE id = ?", [
        Number(logData.id),
      ]);
      router.back();
    } catch (e) {
      console.error(e);
    }
  };

  const getLogPeople = async () => {
    const people = await db.getAllAsync<SelectionType>(
      "SELECT * FROM people WHERE id IN (SELECT person_id FROM emotion_log_people WHERE log_id = ?)",
      [Number(logData.id)]
    );
    setLogPeople(people);
    setNewPeople(people);
  };

  const getLogPlaces = async () => {
    const places = await db.getAllAsync<SelectionType>(
      "SELECT * FROM places WHERE id IN (SELECT place_id FROM emotion_log_places WHERE log_id = ?)",
      [Number(logData.id)]
    );
    setLogPlaces(places);
    setNewPlaces(places);
  };

  const renderSelectable = ({ item }: { item: SelectionType }) => {
    return (
      <View
        style={{ backgroundColor: item.color, padding: 10, borderRadius: 20 }}
      >
        <Text>{item.name}</Text>
      </View>
    );
  };

  const updateDiaryData = (field: "root" | "need" | "extra", data: string) => {
    setDiaryData(sortDiaryData(field, data, diaryData));
  };

  const handleCancelChanges = () => {
    if (
      diaryData.root !== String(logData.root) ||
      diaryData.need !== String(logData.need) ||
      diaryData.extra !== String(logData.extra) ||
      newPeople.some((person) => !logPeople.some((p) => p.id == person.id)) ||
      newPeople.length !== logPeople.length ||
      paths.length !== originalPaths.length ||
      paths[paths.length - 1] !== originalPaths[originalPaths.length - 1] ||
      newPlaces.some((place) => !logPlaces.some((p) => p.id == place.id)) ||
      newPlaces.length !== logPlaces.length
    ) {
      Alert.alert("Discard changes?", "Your changes won't be saved.", [
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setIsEditingEnabled(false);
            setDiaryData({
              root: String(logData.root),
              need: String(logData.need),
              extra: String(logData.extra),
            });
            setNewPeople(logPeople);
          },
        },
        {
          text: "Resume editing",
        },
      ]);
    } else {
      setIsEditingEnabled(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Update diary data if it's changed
      if (
        diaryData.root !== String(logData.root) ||
        diaryData.need !== String(logData.need) ||
        diaryData.extra !== String(logData.extra)
      ) {
        await db.runAsync(
          "UPDATE emotion_logs SET root = ?, need = ?, extra = ? WHERE id = ?",
          [
            diaryData.root ? diaryData.root : "",
            diaryData.need ? diaryData.need : "",
            diaryData.extra ? diaryData.extra : "",
            Number(logData.id),
          ]
        );
      }

      // Update people if they've changed
      if (
        newPeople.some((person) => !logPeople.some((p) => p.id == person.id))
      ) {
        const peopleQuery = `DELETE FROM emotion_log_people WHERE log_id = ${Number(
          logData.id
        )};`;
        peopleQuery && (await db.runAsync(peopleQuery));
        const peopleQuery2 = `INSERT INTO emotion_log_people (log_id, person_id) VALUES ${newPeople
          .map((person) => `(${Number(logData.id)}, ${person.id})`)
          .join(", ")};`;
        peopleQuery2 && (await db.runAsync(peopleQuery2));
      }

      // Update paths if they've changed
      if (paths[paths.length - 1] !== originalPaths[originalPaths.length - 1]) {
        const query = generateSvgEntry(Number(logData.id));
        query && (await db.runAsync(query));
      }

      // Update places if they've changed
      if (newPlaces.some((place) => !logPlaces.some((p) => p.id == place.id))) {
        const placesQuery = `DELETE FROM emotion_log_places WHERE log_id = ${Number(
          logData.id
        )};`;
        placesQuery && (await db.runAsync(placesQuery));
        const placesQuery2 = `INSERT INTO emotion_log_places (log_id, place_id) VALUES ${newPlaces
          .map((place) => `(${Number(logData.id)}, ${place.id})`)
          .join(", ")};`;
        placesQuery2 && (await db.runAsync(placesQuery2));
      }
    } catch (e) {
      console.error(e);
    }

    // Update the localSearchParams
    logData.root = diaryData.root ? diaryData.root : "";
    logData.need = diaryData.need ? diaryData.need : "";
    logData.extra = diaryData.extra ? diaryData.extra : "";
    getLogPeople();

    router.setParams(logData);

    setIsEditingEnabled(false);
  };

  const generateSvgEntry = (id: number) => {
    let query = `INSERT INTO bodydrawing_svg_paths (id, path, color, size) VALUES `;
    if (paths && paths.length > 1) {
      paths.shift();
      paths.forEach((value, index) => {
        const path = value[0].join("/");

        if (index == paths.length - 1) {
          query += `(${id}, '${path}', '${value[1]}', ${value[2]});`;
        } else {
          query += `(${id}, '${path}', '${value[1]}', ${value[2]}), `;
        }
      });
      return query;
    } else {
      return false;
    }
  };

  const getSvgData = async () => {
    try {
      const data = await db.getAllAsync<SvgDataType>(
        "SELECT * FROM bodydrawing_svg_paths WHERE id = ?",
        [logData.id as string]
      );
      let strokeData: StrokeType[] = [];
      data.forEach((value) => {
        const svgArray = value.path.split("/");
        strokeData.push([svgArray, value.color, value.size]);
      });

      setOriginalPaths(strokeData);
      setPaths(strokeData);
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------------
  // EFFECTS
  // ---------------------
  useEffect(() => {
    getLogPeople();
    getLogPlaces();
    getSvgData();
  }, []);

  // ---------------------
  // COMPONENT
  // ---------------------
  return (
    <View style={{ backgroundColor: "beige", height: height, width: width }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            paddingTop: 30,
            paddingHorizontal: 14,
            borderBottomWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            backgroundColor: String(logData.color),
            height: height * 0.12,
          }}
        >
          <View>
            {isEditingEnabled ? (
              <View
                style={{
                  position: "sticky",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity onPress={handleCancelChanges}>
                  <Ionicons name="close" size={30} color="black" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                  }}
                >
                  Editing
                </Text>
                <TouchableOpacity onPress={handleSaveChanges}>
                  <FontAwesome6 name="check" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  position: "sticky",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                  }}
                >
                  {logData.emotion}
                </Text>
                {/* Options */}
                {isOptionsDropdownVisible ? (
                  <TouchableOpacity
                    onPress={() => {
                      setIsOptionsDropdownVisible(false);
                    }}
                  >
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setIsOptionsDropdownVisible(true);
                    }}
                  >
                    <Entypo
                      name="dots-three-vertical"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
        {/* Options dropdown */}
        {isOptionsDropdownVisible && (
          <View
            style={[
              styles.optionsDropdown,
              { backgroundColor: String(logData.color) },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setIsEditingEnabled(true);
                setIsOptionsDropdownVisible(false);
              }}
              style={styles.optionItem}
            >
              <Feather name="edit-2" size={24} color="black" />
              <Text style={{ fontSize: 18 }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteLog} style={styles.optionItem}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={26}
                color="black"
              />
              <Text style={{ fontSize: 18 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Log Data */}
        {isEditingEnabled ? (
          <ScrollView
            scrollEnabled={false}
            ref={editingScreenRef}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <Journal
              initialFieldState={true}
              currentEmotion={{
                // Hack because i'm too lazy to redo the whole stock emotion system
                id: 0,
                name: String(logData.emotion),
                parent: null,
                color: String(logData.color),
                level: 0,
                isCustom: 0,
                hidden: false,
              }}
              passDiaryData={updateDiaryData}
              diaryData={diaryData}
              editMode={true}
              onButtonPress={() => {
                editingScreenRef.current?.scrollTo({
                  x: width,
                  y: 0,
                  animated: true,
                });
              }}
              selectedPeople={newPeople}
              selectedPlaces={newPlaces}
              onUpdateSelectedPeople={setNewPeople}
              onUpdateSelectedPlaces={setNewPlaces}
            />
            <BodyDrawing
              onButtonPress={() => {
                editingScreenRef.current?.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              }}
              initialPaths={originalPaths}
              passPathsToParent={(paths) => {
                setPaths(paths);
              }}
              initialColor={String(logData.color)}
              editMode={true}
            />
            <TouchableOpacity
              onPress={() => {}}
              style={{ position: "absolute", bottom: height * 0.9 }}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexGrow: 1,
              }}
            >
              {/* Journal */}
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 20,
                  flex: 1,
                  width: width,
                }}
              >
                {/* Cause */}
                {logData.root.length > 0 && (
                  <View style={styles.emotionDetail}>
                    <View
                      style={[
                        styles.emotionDetailTitleBackground,
                        { backgroundColor: String(logData.color) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.emotionDetailTitle,
                          {
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                          },
                        ]}
                      >
                        Why?
                      </Text>
                    </View>
                    <Text style={styles.detailContent}>{logData.root}</Text>
                  </View>
                )}
                {/* Need */}
                {logData.need.length > 0 && (
                  <View style={styles.emotionDetail}>
                    <View
                      style={[
                        styles.emotionDetailTitleBackground,
                        { backgroundColor: String(logData.color) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.emotionDetailTitle,
                          {
                            backgroundColor: "rgba(0, 0, 0, 0.15)",
                          },
                        ]}
                      >
                        What did I need?
                      </Text>
                    </View>
                    <Text style={styles.detailContent}>{logData.need}</Text>
                  </View>
                )}
                {/* People */}
                {logPeople.length > 0 && (
                  <View style={styles.emotionDetail}>
                    <View
                      style={[
                        styles.emotionDetailTitleBackground,
                        { backgroundColor: String(logData.color) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.emotionDetailTitle,
                          {
                            backgroundColor: "rgba(0, 0, 0, 0.20)",
                          },
                        ]}
                      >
                        Who was I with?
                      </Text>
                    </View>
                    <FlatList
                      scrollEnabled={false}
                      data={logPeople}
                      renderItem={renderSelectable}
                      contentContainerStyle={{
                        marginVertical: 6,
                        gap: 10,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                  </View>
                )}
                {/* Places */}
                {logPlaces.length > 0 && (
                  <View style={styles.emotionDetail}>
                    <View
                      style={[
                        styles.emotionDetailTitleBackground,
                        { backgroundColor: String(logData.color) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.emotionDetailTitle,
                          {
                            backgroundColor: "rgba(0, 0, 0, 0.25)",
                          },
                        ]}
                      >
                        Where was I?
                      </Text>
                    </View>
                    <FlatList
                      scrollEnabled={false}
                      data={logPlaces}
                      renderItem={renderSelectable}
                      contentContainerStyle={{
                        marginVertical: 6,
                        gap: 10,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                  </View>
                )}
                {/* Diary */}
                {logData.extra.length > 0 && (
                  <View style={styles.emotionDetail}>
                    <View
                      style={[
                        styles.emotionDetailTitleBackground,
                        { backgroundColor: String(logData.color) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.emotionDetailTitle,
                          {
                            backgroundColor: "rgba(0, 0, 0, 0.25)",
                          },
                        ]}
                      >
                        Diary
                      </Text>
                    </View>
                    <Text style={styles.detailContent}>{logData.extra}</Text>
                  </View>
                )}
              </View>
              {/* BodyDrawing */}
              <View>
                <BodyDisplay logId={Number(logData.id)} />
              </View>
              {/* Date of creation */}
              <View
                style={{
                  height: height * 0.08,
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.1)",
                }}
              >
                <Text style={styles.date}>
                  {logData.date} • {logData.time}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emotionDetailTitleBackground: {
    borderRadius: 30,
    height: height * 0.04,
    marginVertical: 8,
  },
  emotionDetail: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emotionDetailTitle: {
    textAlign: "center",
    fontSize: 17,
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 4,
  },
  detailContent: {
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  date: {
    textAlign: "center",
    fontSize: 18,
  },
  optionsDropdown: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    top: height * 0.12,
    right: 0,
    gap: 20,
    marginRight: 6,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 12,
    paddingRight: 20,
    width: width * 0.36,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
