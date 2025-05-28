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
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

const { width, height } = Dimensions.get("window");

const settings = () => {
  const router = useRouter();
  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter >= 3) {
      setIsAdminPanelVisible(true);
    }
  }, [counter]);

  const openPanel = (title: 'adminPanel' | 'language' | 'theme' | 'about') => {
    router.push(`/settings/${title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.settingButton} onPress={() => openPanel('language')}>
          <Ionicons name="language" size={24} color="black" />
          <Text style={styles.settingButtonText}>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton} onPress={() => openPanel('theme')}>
          <Ionicons name="sunny" size={24} color="black" />
          <Text style={styles.settingButtonText}>Theme</Text>
        </TouchableOpacity>        
        <TouchableOpacity style={styles.settingButton} onPress={() => openPanel('about')}>
          <Feather name="info" size={24} color="black" />
          <Text style={styles.settingButtonText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton} onPress={() => {setCounter(counter => counter + 1)}}>
          <Text style={{color: 'gray', fontSize: 18}}>Version: 1.0.0</Text>
        </TouchableOpacity>
        {isAdminPanelVisible && <TouchableOpacity style={styles.settingButton} onPress={() => openPanel('adminPanel')}>
          <Text style={styles.settingButtonText}>Admin panel</Text>
        </TouchableOpacity>}
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
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingButtonText: {
    fontSize: 20,
  }
});
