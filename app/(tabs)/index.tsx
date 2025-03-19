import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  GestureResponderEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Emotion from "../../components/Emotion";
import { useEffect, useState } from "react";
import Level from "../../components/Level";
import axios from "axios";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Header from "../../components/Header";

type EmotionType = {
  name: string;
  parent: string | null;
  color: string;
};

export default function App() {
  const [level, setLevel] = useState(1),
    // [emotion, setEmotion] = useState<EmotionType>(),
    [emotionStack, setEmotionStack] = useState<EmotionType[]>([]),
    [data, setData] = useState<EmotionType[]>([]);

  const { emotionData } = require("../../assets/data/emotions/emotionData.ts");
  const emotion = emotionStack[emotionStack.length - 1];

  const getData = () => {
    if (level > 1 && emotion) {
      setData(Object.values(emotionData[level][emotion.name] || {})); // Convert object to array and set it as data
    } else {
      setData(Object.values(emotionData[level] || {}));
    }
  };

  useEffect(() => {
    if (level === 1) {
      setEmotionStack([]);
    } else if (level > 3) {
      return;
    }
    getData();
  }, [level]);

  const handleGoBack = () => {
    setLevel(level - 1);
    setEmotionStack(emotionStack.slice(0, -1)); // Remove last inserted emotion
  };

  const handleButtonClick = (item: EmotionType) => {
    setLevel(level + 1);
    setEmotionStack([...emotionStack, item]);
  };

  return (
    <LinearGradient colors={["beige", "beige"]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header
          level={level}
          handleGoBack={handleGoBack}
          name={emotion ? emotion.name : ""}
          color={emotion ? emotion.color : ""}
        />

        {/* Emotions */}
        {level < 4 ? (
          <View
            style={{
              flex: 1,
              // justifyContent: "center",
              // alignItems: "center",
              flexDirection: "column",
              borderColor: "red",
              marginTop: 10,
            }}
          >
            <FlatList
              scrollEnabled={true}
              numColumns={2}
              data={data}
              renderItem={({ item }) => {
                return (
                  <Emotion
                    name={item["name"]}
                    color={item["color"]}
                    onClick={() => {
                      handleButtonClick(item);
                    }}
                  />
                );
              }}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              paddingBottom: 40,
            }}
          >
            <View style={{ paddingTop: 10 }}>
              <Text style={{ fontSize: 20 }}>
                Why are you feeling {emotion.name}?
              </Text>
              <TextInput
                placeholder={"..."}
                placeholderTextColor="#555"
                style={{
                  height: 120,
                  width: 300,
                  padding: 10,
                  marginTop: 6,
                  fontSize: 16,
                  borderRadius: 10,
                  backgroundColor: emotion.color,
                }}
              />
            </View>
            <View>
              <Text style={{ marginTop: 10, fontSize: 20 }}>
                Is it giving or taking energy?
              </Text>
              <TextInput
                placeholder={"..."}
                placeholderTextColor="#555"
                style={{
                  height: 70,
                  width: 300,
                  padding: 10,
                  marginTop: 6,
                  fontSize: 16,
                  borderRadius: 10,
                  backgroundColor: emotion.color,
                }}
              />
            </View>
            <View>
              <Text style={{ marginTop: 10, fontSize: 20 }}>
                How are you dealing with it?
              </Text>
              <TextInput
                placeholder={"..."}
                placeholderTextColor="#555"
                style={{
                  width: 300,
                  height: 100,
                  padding: 10,
                  marginTop: 6,
                  fontSize: 16,
                  borderRadius: 10,
                  backgroundColor: emotion.color,
                }}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "beige",
  },
  block: {
    height: 70,
  },
});
