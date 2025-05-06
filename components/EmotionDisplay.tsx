import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Touchable,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Emotion from "./Emotion";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Dimensions } from "react-native";
import BodyDrawing from "./BodyDrawing";
import { useGlobalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSQLiteContext } from "expo-sqlite";
import * as Haptics from "expo-haptics";
import { uncapitalise } from "@/assets/functions";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type DiaryType = {
  root: string | undefined;
  need: string | undefined;
  extra: string | undefined;
};

interface Props {
  level: number;
  data: EmotionType[];
  currentEmotion: EmotionType;
  passHandleClickEmotion: (item: EmotionType, svgData?: StrokeType[]) => void;
  handleCreateLog: () => void;
  bodyDrawingData: StrokeType[] | undefined;
  passBodyDrawingData: (data: StrokeType[]) => void;
  diaryData: DiaryType | undefined;
  passDiaryData: (field: string, data: string) => void;
  isEditingEnabled: boolean;
  toggleEditing: (state: boolean) => void;
  refresh: () => void;
}

type EmotionType = {
  id: number;
  name: string;
  parent: string | null;
  color: string;
  level: number;
  isCustom: number;
};

type StrokeType = [string[], string, number];

const { width, height } = Dimensions.get("window");

const EmotionDisplay = ({
  level,
  data,
  currentEmotion,
  passHandleClickEmotion,
  handleCreateLog,
  bodyDrawingData,
  diaryData,
  passDiaryData,
  passBodyDrawingData,
  toggleEditing,
  isEditingEnabled,
  refresh,
}: Props) => {
  const router = useRouter();
  const params = useGlobalSearchParams<{ level: string }>();
  const db = useSQLiteContext();

  // States
  const [bottomPadding, setBottomPadding] = useState(50);

  // Functions
  const newCustomEmotion = () => {
    const params = currentEmotion
      ? { level: level, name: currentEmotion.name, color: currentEmotion.color }
      : { level: level };
    router.push({
      pathname: "/newCustomEmotion",
      params: params,
    });
  };

  const deleteEmotion = (id: number) => {
    Alert.alert(
      "Delete emotion?",
      "This emotion will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await db.runAsync(
                "DELETE FROM user_created_emotions WHERE id = ?",
                [id]
              );
              refresh();
            } catch (e) {
              console.error(e);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const height = Dimensions.get("window").height;

  // Add a placeholder +1 item at the end, in the place of which a button to create a new emotion will be placed
  data = [
    ...data,
    {
      id: 0,
      color: "",
      level: 0,
      name: "placeholder",
      parent: null,
      isCustom: 0,
    },
  ];

  // Emotion selection
  switch (level) {
    case 1: // Fallthrough
    case 2: // Fallthrough
    case 3: // Levels 1 through 3
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: "red",
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 80 }}
          >
            <Pressable
              onLongPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                toggleEditing(true);
              }}
            >
              <FlatList
                contentContainerStyle={{
                  // alignItems: "center",
                  // justifyContent: "center",
                  flex: 1,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
                scrollEnabled={false}
                numColumns={2}
                data={data}
                renderItem={({ index, item }) => {
                  // If hit last, previously inserted placeholder item, return button to create new emotion
                  if (index == data.length - 1) {
                    if (isEditingEnabled || data.length == 1) {
                      return (
                        <View
                          style={{
                            width: 134,
                            height: 134,
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 10,
                            marginHorizontal: 14,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              borderRadius: 100,
                              backgroundColor: "rgba(0,0,0,0.1)",
                              height: 90,
                              width: 90,
                              margin: 10,

                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={newCustomEmotion}
                          >
                            <AntDesign name="plus" size={28} color={"black"} />
                          </TouchableOpacity>
                        </View>
                      );
                    } else {
                      return <View />;
                    }
                  }
                  // Else, return normal emotion
                  return (
                    // If editing is enabled, show delete button for custom emotions
                    <View>
                      {isEditingEnabled && item.isCustom == 1 && (
                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            top: height * 0.02,
                            left: width * 0.04,
                            zIndex: 1,
                            elevation: 1,
                            backgroundColor: "#dcdcc5",
                            borderRadius: 50,
                            padding: 4,
                          }}
                          onPress={() => {
                            deleteEmotion(item.id);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={22}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}
                      <Emotion
                        name={item["name"]}
                        color={item["color"]}
                        onClick={() => {
                          isEditingEnabled
                            ? () => {} // Disable advancing if editing is enabled
                            : passHandleClickEmotion(item);
                        }}
                      />
                    </View>
                  );
                }}
              />
            </Pressable>
          </ScrollView>
        </View>
      );
      break;
    case 4: // Body drawing level
      return (
        <View>
          <BodyDrawing
            initialColor={currentEmotion.color}
            initialPaths={bodyDrawingData}
            passPathsToParent={(paths) => {
              passBodyDrawingData(paths);
            }}
            onNext={() => {
              passHandleClickEmotion(currentEmotion);
            }}
          />
        </View>
      );
      break;
    default: // Final, diary level
      return (
        <View style={{ height: height * 0.87, width: width }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: bottomPadding,
            }}
          >
            {/* Journalling */}
            <View
              style={{
                marginTop: 20,
                gap: 20,
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 40,
              }}
            >
              {/* Root */}
              <View>
                <Text style={{ fontSize: 20 }}>
                  Why do you feel{" " + uncapitalise(currentEmotion.name)}?
                </Text>
                <TextInput
                  value={diaryData && diaryData.root}
                  multiline={true}
                  numberOfLines={10}
                  placeholder={"Type here..."}
                  placeholderTextColor="#555"
                  onChangeText={(value) => {
                    passDiaryData("root", value);
                  }}
                  style={{
                    width: 320,
                    minHeight: 60,
                    height: "auto",
                    padding: 10,
                    marginTop: 6,
                    fontSize: 16,
                    borderRadius: 10,
                    backgroundColor: String(currentEmotion.color),
                    // Shadow
                    shadowColor: String(currentEmotion.color),
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                  }}
                />
              </View>
              {/* Need */}
              <View>
                <Text style={{ marginTop: 10, fontSize: 18 }}>
                  What do you need in this moment?
                </Text>
                <TextInput
                  value={diaryData && diaryData.need}
                  multiline={true}
                  numberOfLines={10}
                  placeholder={"Type here..."}
                  placeholderTextColor="#555"
                  onChangeText={(value) => {
                    passDiaryData("need", value);
                  }}
                  style={{
                    width: 320,
                    minHeight: 80,
                    height: "auto",
                    padding: 10,
                    marginTop: 6,
                    fontSize: 16,
                    borderRadius: 10,
                    backgroundColor: String(currentEmotion.color),
                    // Shadow
                    shadowColor: String(currentEmotion.color),
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                  }}
                />
              </View>
              {/* Extra */}
              <View>
                <Text style={{ marginTop: 10, fontSize: 16 }}>
                  Anything else?
                </Text>
                <TextInput
                  onPressIn={() => {
                    bottomPadding != 260 && setBottomPadding(260);
                  }}
                  onEndEditing={() => {
                    setBottomPadding(50);
                  }}
                  value={diaryData && diaryData.extra}
                  multiline={true}
                  numberOfLines={10}
                  placeholder={"Type here..."}
                  placeholderTextColor="#555"
                  onChangeText={(value) => {
                    passDiaryData("extra", value);
                  }}
                  style={{
                    width: 320,
                    minHeight: 90,
                    height: "auto",
                    padding: 10,
                    marginTop: 6,
                    fontSize: 16,
                    borderRadius: 10,
                    backgroundColor: String(currentEmotion.color),
                    // Shadow
                    shadowColor: String(currentEmotion.color),
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                  }}
                />
              </View>
            </View>
          </ScrollView>
          {/* Save button */}
          <View
            style={{
              position: "absolute",
              bottom: 20,
              alignSelf: "center",
              // flexDirection: "row",
              // justifyContent: "center",
              // paddingBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleCreateLog();
              }}
              style={{
                flexDirection: "row",
                paddingHorizontal: 30,
                justifyContent: "center",
                gap: 10,
                alignItems: "center",
                height: 60,
                backgroundColor: "#e3d7b7",
                borderRadius: 50,
              }}
            >
              <Text style={{ fontSize: 24 }}>
                Save{" "}
                {/* <Text
                    style={{
                      color: currentEmotion.color,
                      // Shadow
                      textShadowColor: "rgba(0, 0, 0, 0.2)",
                      textShadowOffset: { width: -1, height: 1 },
                      textShadowRadius: 10,
                    }}
                  >
                    {currentEmotion.name}
                  </Text> */}
              </Text>
              <FontAwesome6 name="check" size={26} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      );
      break;
  }
};

const styles = StyleSheet.create({
  emotionContainer: {
    flex: 1,
    width: 170,
    height: 70,
    gap: 10,
  },
  start: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startText: {
    fontSize: 20,
  },
  button: {
    marginTop: 50,
    backgroundColor: "lightgreen",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default EmotionDisplay;
