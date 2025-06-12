import { View } from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";

const newCustomEmotionInit = () => {
  // ---------------------
  // CONSTS
  // ---------------------
  const router = useRouter();

  // ---------------------
  // EFFECTS
  // ---------------------
  useFocusEffect(
    useCallback(() => {
      router.push("/logNewEmotion");
    }, [])
  );

  // ---------------------
  // COMPONENT
  // ---------------------
  return <View style={{ flex: 1, backgroundColor: "beige" }} />;
};

export default newCustomEmotionInit;
