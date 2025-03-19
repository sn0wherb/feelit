import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Updates from "expo-updates";

const settings = () => {
  return (
    <SafeAreaView>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 200,
          marginHorizontal: 30,
          backgroundColor: "green",
          borderRadius: 10,
        }}
      >
        <Button
          onPress={Updates.reloadAsync}
          title="Reload app"
          color="white"
        />
      </View>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({});
