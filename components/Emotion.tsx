import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  GestureResponderEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  name: string;
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
      borderColor: "black",
      // borderWidth: 2,
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
    <View style={[styles.emotion, styles.colorShadow]}>
      <Button
        onPress={() => {
          onClick(name);
        }}
        title={name}
        color={"black"}
      />
    </View>
  );
}

export default Emotion;
