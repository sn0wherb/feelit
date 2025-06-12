import { View } from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";

const newCustomEmotionInit = () => {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      router.push("/logNewEmotion");
    }, [])
  );

  return <View style={{ flex: 1, backgroundColor: "beige" }} />;
};

export default newCustomEmotionInit;
