import { uncapitalise } from "@/assets/functions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import JournalField from "./JournalField";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

interface Props {
  currentEmotion: EmotionType;
  passDiaryData: (field: "root" | "need" | "extra", data: string) => void;
  diaryData: DiaryType | undefined;
  onButtonPress: () => void;
  selectedPeople: SelectionType[];
  selectedPlaces: SelectionType[];
  onUpdateSelectedPeople: (people: SelectionType[]) => void;
  onUpdateSelectedPlaces: (places: SelectionType[]) => void;
  initialFieldState?: boolean;
  editMode?: boolean;
}

const Journal = ({
  currentEmotion,
  passDiaryData,
  diaryData,
  onButtonPress,
  selectedPeople,
  selectedPlaces,
  onUpdateSelectedPeople,
  onUpdateSelectedPlaces,
  initialFieldState = false,
  editMode = false,
}: Props) => {
  // ---------------------
  // CONSTS
  // ---------------------
  const bottomPadding = 50;

  // ---------------------
  // COMPONENT
  // ---------------------
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
          <JournalField
            initialFieldState={initialFieldState}
            title={"Why do you feel " + uncapitalise(currentEmotion.name) + "?"}
            value={diaryData?.root}
            onChangeText={(value) => {
              passDiaryData("root", value);
            }}
            currentEmotion={currentEmotion}
          />
          {/* Need */}
          <JournalField
            initialFieldState={initialFieldState}
            title={"What do you need in this moment?"}
            value={diaryData?.need}
            onChangeText={(value) => {
              passDiaryData("need", value);
            }}
            currentEmotion={currentEmotion}
          />
          {/* People */}
          <JournalField
            title={"Who are you with?"}
            type={"person"}
            currentEmotion={currentEmotion}
            selectedData={selectedPeople}
            onUpdateSelectedData={onUpdateSelectedPeople}
          />
          {/* Places */}
          <JournalField
            title={"Where are you?"}
            type={"place"}
            currentEmotion={currentEmotion}
            selectedData={selectedPlaces}
            onUpdateSelectedData={onUpdateSelectedPlaces}
          />
          {/* Diary */}
          <JournalField
            initialFieldState={initialFieldState}
            title={"Free write"}
            onChangeText={(value) => {
              passDiaryData("extra", value);
            }}
            value={diaryData?.extra}
            currentEmotion={currentEmotion}
          />
        </View>
      </ScrollView>
      {/* Save button */}
      {editMode ? (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
          }}
        >
          <TouchableOpacity
            onPress={onButtonPress}
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              justifyContent: "center",
              gap: 10,
              alignItems: "center",
              height: 50,
              backgroundColor: "#e3d7b7",
              borderRadius: 50,
            }}
          >
            <Text style={{ fontSize: 20 }}>Drawing</Text>
            <AntDesign name="arrowright" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
          }}
        >
          <TouchableOpacity
            onPress={onButtonPress}
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              justifyContent: "center",
              gap: 10,
              alignItems: "center",
              height: 50,
              backgroundColor: "#e3d7b7",
              borderRadius: 50,
            }}
          >
            <Text style={{ fontSize: 20 }}>Save </Text>
            <FontAwesome6 name="check" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Journal;
