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

const { width, height } = Dimensions.get("window");

const newCustomEmotion = () => {
  const router = useRouter();
  const db = useSQLiteContext();

  // Deconstruct received data
  const data = useLocalSearchParams();
  const level = Number(data.level);
  const name = data.name ? String(data.name) : null;
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
        `INSERT INTO user_created_emotions (name, parent, color) VALUES (?,?,?)`,
        [title, name, newColor]
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
            color=""
            name=""
            level={level}
            handleGoBack={handleGoBack}
            custom={true}
          />
          {name && (
            <View>
              <Text style={[styles.parentName, { color: color }]}>
                {String(name).charAt(0).toLowerCase() + String(name).slice(1)}
              </Text>
            </View>
          )}
          {/* Form */}
          <View style={styles.form}>
            <TextInput
              multiline={false}
              placeholder={"Title"}
              maxLength={20}
              placeholderTextColor="#555"
              onChangeText={(value) => setTitle(value.trim())}
              style={{
                width: 320,
                height: 80,
                // height: "auto",
                padding: 10,
                marginTop: 6,
                marginBottom: 16,
                fontSize: 40,
                borderRadius: 10,
                backgroundColor: newColor,
                // Shadow
                shadowColor: newColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
              }}
            />
            <Text style={styles.fieldTitle}>Color</Text>
            <ColorPicker
              onChangeJS={({ hex }) => {
                setNewColor(hex);
              }}
              style={{
                marginBottom: 40,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              value={color ? color : "#FFF"}
            >
              <Panel1
                boundedThumb
                style={{
                  marginRight: 20,
                  width: width * 0.68,
                  height: width * 0.68,
                }}
              />
              <HueSlider
                style={{ height: width * 0.68 }}
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
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 24 }}>Create emotion</Text>
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
    padding: 30,
  },
  parentName: {
    fontSize: 40,
    marginLeft: 86,
    marginTop: 4,
  },
});
