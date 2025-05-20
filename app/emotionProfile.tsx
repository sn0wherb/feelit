import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");

const emotionProfile = () => {
  const data = useLocalSearchParams();

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: String(data.color) }}>
        <Text>{data.name}</Text>
      </View>
    </SafeAreaView>
  );
};

export default emotionProfile;

const styles = StyleSheet.create({});
