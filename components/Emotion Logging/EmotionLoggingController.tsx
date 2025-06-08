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
import Emotion from "../RenderEmotion";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Dimensions } from "react-native";
import BodyDrawing from "../BodyDrawing/BodyDrawing";
import { useGlobalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSQLiteContext } from "expo-sqlite";
import { uncapitalise } from "@/assets/functions";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import RenderEmotion from "../RenderEmotion";
import EmotionDisplay from "./EmotionDisplay";
import Journal from "./Journal";

interface Props {
  level: number;
  data: EmotionType[];
  currentEmotion: EmotionType;
  passHandleClickEmotion: (item: EmotionType, svgData?: StrokeType[]) => void;
  handleCreateLog: () => void;
  bodyDrawingData: StrokeType[] | undefined;
  passBodyDrawingData: (data: StrokeType[]) => void;
  diaryData: DiaryType | undefined;
  passDiaryData: (field: "root" | "need" | "extra", data: string) => void;
  isEditingEnabled: boolean;
  passToggleEditing: (state: boolean) => void;
  refresh: () => void;
  onToggleHideEmotion: (name: string) => void;
  selectedPeople: PersonType[];
  onUpdateSelectedPeople: (people: PersonType[]) => void;
}

const { width, height } = Dimensions.get("window");

const EmotionLoggingController = ({
  level,
  data,
  currentEmotion,
  passHandleClickEmotion,
  handleCreateLog,
  bodyDrawingData,
  diaryData,
  passDiaryData,
  passBodyDrawingData,
  passToggleEditing,
  isEditingEnabled,
  refresh,
  onToggleHideEmotion,
  selectedPeople = [],
  onUpdateSelectedPeople,
}: Props) => {
  const params = useGlobalSearchParams<{ level: string }>();

  // States
  const [bottomPadding, setBottomPadding] = useState(50);

  // Emotion selection
  switch (level) {
    case 1: // Fallthrough
    case 2: // Fallthrough
    case 3: // Levels 1 through 3
      return (
        <View>
          <EmotionDisplay
            level={level}
            data={data}
            currentEmotion={currentEmotion}
            passHandleClickEmotion={passHandleClickEmotion}
            onToggleHideEmotion={onToggleHideEmotion}
            isEditingEnabled={isEditingEnabled}
            toggleEditing={passToggleEditing}
            refresh={refresh}
          />
        </View>
      );
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
    default: // Final, diary level
      return (
        <View>
          <Journal
            currentEmotion={currentEmotion}
            passDiaryData={passDiaryData}
            diaryData={diaryData}
            handleCreateLog={handleCreateLog}
            selectedPeople={selectedPeople}
            onUpdateSelectedPeople={onUpdateSelectedPeople}
          />
        </View>
      );
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

export default EmotionLoggingController;
