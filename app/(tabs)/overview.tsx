import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const overview = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontSize: 50, color: "#6b5a2c" }}>overview</Text>
      </View>
    </SafeAreaView>
  );
};

export default overview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 18,
    borderColor: "#b4a271",
  },
});
