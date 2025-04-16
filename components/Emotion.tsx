import React, { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  GestureResponderEvent,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  name: string | ReactNode;
  color: string;
  onClick: (name: string) => void;
}

function Emotion({ name, color, onClick }: Props) {
  const styles = StyleSheet.create({
    emotion: {
      height: 134,
      width: 134,
      margin: 10,
      marginHorizontal: 14,
      backgroundColor: color,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
    },
    colorShadow: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
    },
  });

  return (
    <View>
      <TouchableOpacity
        style={[styles.emotion, styles.colorShadow]}
        onPress={() => {
          onClick(String(name));
        }}
        activeOpacity={0.6}
      >
        <Text style={{ fontSize: 18 }}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Emotion;
