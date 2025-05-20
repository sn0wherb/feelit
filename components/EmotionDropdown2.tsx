import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

type EmotionType = {
  id: number;
  name: string;
  parent: string | null;
  color: string;
  level: number;
  isCustom: number;
};

interface Props {
  emotion: EmotionType;
}

const { width, height } = Dimensions.get("window");

const EmotionDropdown2 = ({ emotion }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Functions
  const handleOpenEmotion = () => {
    const params = Object.assign(emotion);
    // params["date"] = date;
    // params["time"] = time;
    router.push({
      pathname: "/emotionProfile",
      params: params,
    });
  };

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Chevron */}
        {/* <TouchableOpacity
          style={{ marginHorizontal: 6 }}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Feather
            name={isOpen ? "chevron-down" : "chevron-right"}
            size={30}
            color="black"
          />
        </TouchableOpacity> */}
        {/* Emotion */}
        <TouchableOpacity
          style={{
            padding: 8,
            marginTop: 6,
            borderRadius: 20,
            backgroundColor: emotion.color,
            width: width * 0.7,
            height: height * 0.08,
            justifyContent: "center",
          }}
          onPress={handleOpenEmotion}
        >
          <Text style={{ fontSize: 24, textAlign: "center" }}>
            {emotion.name}
          </Text>
        </TouchableOpacity>
        {/* <View style={{ width: width * 0.1 }}></View> */}
      </View>
      {isOpen && (
        <View style={{ marginLeft: 30 }}>
          <EmotionDropdown2 emotion={emotion} />
        </View>
      )}
    </View>
  );
};

export default EmotionDropdown2;

const styles = StyleSheet.create({});
