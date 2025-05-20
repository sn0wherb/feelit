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

const EmotionDropdown = ({ emotion }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Functions
  const handleOpenEmotion = () => {
    router.push("/emotionProfile");
  };

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Chevron */}
        <TouchableOpacity
          style={{ marginHorizontal: 6 }}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Feather
            name={isOpen ? "chevron-down" : "chevron-right"}
            size={30}
            color="black"
          />
        </TouchableOpacity>
        {/* Emotion */}
        <TouchableOpacity
          style={{
            padding: 8,
            marginVertical: 6,
            borderRadius: 10,
            backgroundColor: emotion.color,
            width: width * 0.7,
          }}
          onPress={handleOpenEmotion}
        >
          <Text style={{ fontSize: 22 }}>{emotion.name}</Text>
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View style={{ marginLeft: 30 }}>
          <EmotionDropdown emotion={emotion} />
        </View>
      )}
    </View>
  );
};

export default EmotionDropdown;

const styles = StyleSheet.create({});
