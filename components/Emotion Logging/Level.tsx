import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";

interface Props {
  level: number;
  goBack: () => void;
  emotion: string;
}

const Level = ({ level, goBack, emotion }: Props) => {
  switch (level) {
    case 1:
      return (
        <View>
          <Text style={styles.title}>How are you feeling?</Text>
        </View>
      );
    case 2: // fallthrough
    case 3:
      return (
        <View>
          <Text style={styles.title}>What kind of {emotion}?</Text>
        </View>
      );
    case 4:
      return (
        <View style={styles.goBack}>
          <Text style={styles.title}>
            Congrats on feeling {emotion}... I guess
          </Text>
          <Button onPress={goBack} title="Return"></Button>
        </View>
      );
    default:
      break;
  }
};

const styles = StyleSheet.create({
  title: {
    padding: 30,
    fontSize: 25,
    textAlign: "center",
  },
  goBack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Level;
