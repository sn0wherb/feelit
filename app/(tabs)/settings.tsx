import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const settings = () => {
  const router = useRouter();

  const openPanel = (title: string) => {
    // @ts-expect-error
    router.push(`/settings/${title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.settingButton} onPress={() => openPanel('adminPanel')}>
          <Text style={styles.settingButtonText}>Admin panel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton} onPress={() => openPanel('language')}>
          <Text style={styles.settingButtonText}>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton} onPress={() => openPanel('theme')}>
          <Text style={styles.settingButtonText}>Theme</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: "beige",
  },
  settingButton: {
    padding: 30
  },
  settingButtonText: {
    fontSize: 20,
  }
});
