import { View, Text } from "react-native";
import React, { useCallback } from "react";
import { Redirect, useFocusEffect, useRouter } from "expo-router";

const newCustomEmotionInit = () => {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      router.push("/logNewEmotion");
    }, [])
  );

  return <View style={{ backgroundColor: "beige" }} />;
};

export default newCustomEmotionInit;
