import { uncapitalise } from "@/assets/functions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import JournalField from "./JournalField";

const { width, height } = Dimensions.get("window");

interface Props {
    currentEmotion: EmotionType;
    passDiaryData: (field: string, data: string) => void;
    handleCreateLog: () => void;
}

const Journal = ({ currentEmotion, passDiaryData, handleCreateLog }: Props) => {
    const [bottomPadding, setBottomPadding] = useState(50);
    const [isJournalFieldOpen, setIsJournalFieldOpen] = useState(false);

    // Functions
    const handleOpenJournalField = () => {
        setIsJournalFieldOpen(true);
    }

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
                title={"Why do you feel " + uncapitalise(currentEmotion.name) + "?"}
                value=""
                // onChangeText={(value) => {
                //     passDiaryData("root", value);
                // }}
                currentEmotion={currentEmotion}
              />
              {/* Need */}
              <JournalField
                title={"What do you need in this moment?"}
                value=""
                // onChangeText={(value) => {
                //     passDiaryData("root", value);
                // }}
                currentEmotion={currentEmotion}
              />
                {/* Need */}
                <JournalField
                title={"Who are you with?"}
                type={"selection"}
                value=""
                // onChangeText={(value) => {
                //     passDiaryData("root", value);
                // }}
                currentEmotion={currentEmotion}
              />
              {/* <View>
                <Text style={{ fontSize: 20 }}>
                  Why do you feel{" " + uncapitalise(currentEmotion.name)}?
                </Text>
                <TextInput
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
              </View> */}
              {/* Need */}
              {/* <View>
                <Text style={{ marginTop: 10, fontSize: 18 }}>
                  What do you need in this moment?
                </Text>
                <TextInput
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
              </View> */}
              {/* Extra */}
              {/* <View>
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
              </View> */}
            </View>
          </ScrollView>
          {/* Save button */}
          <View
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
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
}

export default Journal;