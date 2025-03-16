import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  GestureResponderEvent,
} from "react-native";

interface Props {
  name: string;
  color: string;
  onClick: (name: string) => void;
}

function Emotion({ name, color, onClick }: Props) {
  const styles = StyleSheet.create({
    emotion: {
      flex: 1,
      justifyContent: "center",
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 20,
      backgroundColor: color,
    },
  });

  return (
    <View style={styles.emotion}>
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
