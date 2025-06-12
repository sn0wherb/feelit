import { View, StyleSheet } from "react-native";
import BodyDrawing from "../BodyDrawing/BodyDrawing";
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
  selectedPeople: SelectionType[];
  onUpdateSelectedPeople: (people: SelectionType[]) => void;
  selectedPlaces: SelectionType[];
  onUpdateSelectedPlaces: (people: SelectionType[]) => void;
}

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
  selectedPlaces = [],
  onUpdateSelectedPlaces,
}: Props) => {
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
            onButtonPress={() => {
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
            onButtonPress={handleCreateLog}
            selectedPeople={selectedPeople}
            onUpdateSelectedPeople={onUpdateSelectedPeople}
            selectedPlaces={selectedPlaces}
            onUpdateSelectedPlaces={onUpdateSelectedPlaces}
          />
        </View>
      );
  }
};

const styles = StyleSheet.create({});

export default EmotionLoggingController;
