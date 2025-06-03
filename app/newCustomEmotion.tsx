import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import ColorPicker, { HueSlider, Panel1 } from "reanimated-color-picker";
import { useSQLiteContext } from "expo-sqlite";
import SuccessScreen from "@/components/SuccessScreen";
import { uncapitalise } from "@/assets/functions";

const { width, height } = Dimensions.get("window");

const newCustomEmotion = () => {
  const router = useRouter();
  const db = useSQLiteContext();

  // Deconstruct received data
  const data = useLocalSearchParams();
  const level = Number(data.level);
  const parent = data.name ? String(data.name) : null;
  const color = data.color ? String(data.color) : undefined;

  // New emotion states
  const [newColor, setNewColor] = color ? useState(color) : useState("#fff");
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState(false);

  // Functions
  const handleGoBack = () => {
    router.back();
  };

  const createEmotion = async () => {
    try {
      await db.runAsync(
        `INSERT INTO user_created_emotions (name, parent, color, level) VALUES (?,?,?,?)`,
        [title, parent, newColor, level]
      );
      setSaved(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (saved) {
    setTimeout(() => {
      router.back();
    }, 1600);
  }

  return (
    <View style={styles.container}>
      {saved ? (
        <SafeAreaView>
          <SuccessScreen />
        </SafeAreaView>
      ) : (
        <SafeAreaView>
          <Header
            color={color ? color : "#FFF"}
            name={parent ? uncapitalise(parent) : ""}
            level={level}
            handleGoBack={handleGoBack}
            custom={true}
          />
          {/* Form */}
          <View style={styles.form}>
            <View
              style={{
                height: height * 0.3,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              <TextInput
                multiline={false}
                placeholder={"Enter title"}
                numberOfLines={2}
                maxLength={30}
                placeholderTextColor="#555"
                onChangeText={(value) => setTitle(value.trim())}
                style={{
                  height: 160,
                  width: 160,
                  backgroundColor: newColor,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  wordWrap: "wrap",
                  borderRadius: 50,
                  fontSize: 22,
                  // Shadow
                  shadowColor: newColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                }}
              />
            </View>
            <ColorPicker
              onChangeJS={({ hex }) => {
                setNewColor(hex);
              }}
              style={{
                marginBottom: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
              value={color ? color : "#FFF"}
            >
              <Panel1
                boundedThumb
                style={{
                  marginRight: 20,
                  width: width * 0.6,
                  height: width * 0.6,
                }}
              />
              <HueSlider
                style={{ height: width * 0.6 }}
                vertical
                boundedThumb
                sliderThickness={width * 0.15}
              />
            </ColorPicker>
            {/* Save button */}
            <TouchableOpacity
              onPress={createEmotion}
              style={{
                flexDirection: "row",
                gap: 16,
                width: 320,
                paddingHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                height: 60,
                backgroundColor: "#e3d7b7",
                borderRadius: 30,
              }}
            >
              <Text style={{ fontSize: 24 }}>Save</Text>
              <AntDesign name="arrowright" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default newCustomEmotion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "beige",
  },
  fieldTitle: {
    // textAlign: "center",
    fontSize: 24,
    marginBottom: 6,
  },
  form: {
    paddingHorizontal: 30,
  },
  parentName: {
    fontSize: 30,
    marginLeft: 86,
  },
});
