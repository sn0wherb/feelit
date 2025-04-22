import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const analytics = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontSize: 50, color: "#6b5a2c" }}>Analytics</Text>
      </View>
    </SafeAreaView>
  );
};

export default analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "beige",
    justifyContent: "center",
    alignItems: "center",
  },
});
