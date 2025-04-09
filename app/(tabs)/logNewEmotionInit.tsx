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

  // const redirect = () => {
  //   return <Redirect href={'/logNewEmotion'}/>
  //   // router.push("/logNewEmotion");
  // }

  return (
    <View style={{ flex: 1, backgroundColor: "beige" }}>
      {/* <Redirect href={"/(tabs)/overview"} /> */}
    </View>
  );
};

export default newCustomEmotionInit;
