import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const profiles = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontSize: 50, color: "#6b5a2c" }}>profiles</Text>
      </View>
    </SafeAreaView>
  );
};

export default profiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 18,
    borderColor: "#b4a271",
  },
});
