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
      height: 80,
      width: 134,
      margin: 10,
      marginHorizontal: 14,
      justifyContent: "center",
      borderColor: "black",
      // borderWidth: 2,
      borderRadius: 20,
    },
  });

  return (
    <LinearGradient colors={[color, color]} style={styles.emotion}>
      <Button
        onPress={() => {
          onClick(name);
        }}
        title={name}
        color={"black"}
      />
    </LinearGradient>
  );
}

export default Emotion;
