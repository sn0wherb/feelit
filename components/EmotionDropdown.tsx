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

  const handleOpenEmotion = () => {
    router.push("/emotionProfile");
  };

  if (isOpen) {
    return (
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ marginRight: 6 }}
            onPress={() => setIsOpen(!isOpen)}
          >
            <Feather name="chevron-down" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 10,
              backgroundColor: emotion.color,
              width: width * 0.7,
            }}
            onPress={handleOpenEmotion}
          >
            <Text style={{ fontSize: 22 }}>{emotion.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 30, marginTop: 14 }}>
          <EmotionDropdown emotion={emotion} />
        </View>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        style={{ marginRight: 6 }}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Feather name="chevron-right" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 8,
          borderRadius: 10,
          backgroundColor: emotion.color,
          width: width * 0.7,
        }}
        onPress={handleOpenEmotion}
      >
        <Text style={{ fontSize: 22 }}>{emotion.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmotionDropdown;

const styles = StyleSheet.create({});
