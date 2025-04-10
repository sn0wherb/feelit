import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const SuccessScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 24 }}>Saved successfully!</Text>
      <Ionicons
        name="checkmark-circle"
        size={56}
        color="#728C5E"
        style={{
          shadowColor: "#728C5E",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
        }}
      />
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({});
