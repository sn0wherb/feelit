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

type LanguageType = "English" | "Latviešu" | "Русский";
  
  const { width, height } = Dimensions.get("window");
  
  const language = () => {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>("English");
    const languages = [
        'English',
        'Latviešu',
        'Русский'
    ]
    
    const renderLanguages = ({ item }: { item: string }) => {
        return (
            <TouchableOpacity style={styles.settingButton} onPress={() => {
                setSelectedLanguage(item as LanguageType);
            }}>
                <Text style={styles.settingButtonText}>{item}</Text>
                {selectedLanguage === item && <Ionicons name="checkmark" size={30} color="black" />}
            </TouchableOpacity>
        )
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Select a language</Text>
        </View>
        <FlatList
            scrollEnabled={false}
            data={languages}
            renderItem={renderLanguages}
        />
      </SafeAreaView>
    );
  };
  
  export default language;
  
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
  