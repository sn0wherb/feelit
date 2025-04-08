import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const newCustomEmotion = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <Button
        onPress={() => {
          router.back();
        }}
        title="Go back"
      />
      <Text>newCustomEmotion</Text>
    </SafeAreaView>
  );
};

export default newCustomEmotion;

const styles = StyleSheet.create({});
