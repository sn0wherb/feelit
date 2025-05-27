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

type ThemeType = "Light" | "Beige" | "Dark";
  
  const { width, height } = Dimensions.get("window");
  
  const theme = () => {
    const router = useRouter();
    const [selectedTheme, setSelectedTheme] = useState<ThemeType>("Beige");
    const themes = [
        'Light',
        'Beige',
        'Dark'
    ]

    const getBackgroundColor = (theme: ThemeType) => {
        switch (theme) {
            case "Light":
                return "white";
            case "Beige":
                return "beige";
            case "Dark":
                return "black";
        }
    }
    
    const renderThemes = ({ item }: { item: string }) => {
        return (
            <TouchableOpacity style={[styles.settingButton, {backgroundColor: getBackgroundColor(item as ThemeType)}]} onPress={() => {
                setSelectedTheme(item as ThemeType);
            }}>
                <Text style={[styles.settingButtonText, {color: item === "Dark" ? "white" : "black"}]}>{item}</Text>
                {selectedTheme === item && <Ionicons name="checkmark" size={30} color={item === "Dark" ? "white" : "black"} />}
            </TouchableOpacity>
        )
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Select a theme</Text>
        </View>
        <FlatList
            scrollEnabled={false}
            data={themes}
            renderItem={renderThemes}
        />
      </SafeAreaView>
    );
  };
  
  export default theme;
  
  const styles = StyleSheet.create({
    container: {
      height: height,
      width: width,
      backgroundColor: "beige",
    },
    header: {
        flexDirection: "row",
        padding: 20,
        alignItems: "center",
        gap: width * 0.04,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    settingButton: {
      height: height * 0.1,
      paddingLeft: width * 0.16,
      flexDirection: "row",
      alignItems: 'center',
      gap: width * 0.04,
    },
    settingButtonText: {
      fontSize: 20,
    }
  });
  