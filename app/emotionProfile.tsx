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

const { width, height } = Dimensions.get("window");

const emotionProfile = () => {
  return (
    <SafeAreaView>
      <Text>Emotion profile</Text>
    </SafeAreaView>
  );
};

export default emotionProfile;

const styles = StyleSheet.create({});
