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
  View,
} from "react-native";
import Emotion from "../../components/Emotion";
import { useEffect, useState } from "react";
import Level from "../../components/Level";
import EmotionDisplay from "../../components/EmotionDisplay";
import axios from "axios";
import { useSQLiteContext } from "expo-sqlite";

type EmotionType = {
  id: number;
  name: string;
  level: number;
  parent: string;
};

export default function App() {
  const [level, setLevel] = useState(0),
    [emotion, setEmotion] = useState(""),
    [isLoading, setIsLoading] = useState(true),
    [names, setNames] = useState([]),
    [data, setData] = useState<EmotionType[]>([]),
    [currentName, setCurrentName] = useState(undefined);

  // SQL functions
  const db = useSQLiteContext();
  const getData = async () => {
    try {
      const query = await db.getAllAsync<EmotionType>(
        "SELECT * FROM emotions WHERE level = ?",
        [1]
      );
      setData(query);
      // console.log(data);
    } catch (e) {
      console.error(e);
    }
  };
  const dropTable = async () => {
    try {
      await db.execAsync("DROP TABLE emotions;");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleStart = () => {
    setLevel(1);
  };

  const handleGoBack = () => {
    setLevel(0);
  };

  const handleButtonClick = (name: string) => {
    setEmotion(name);

    setLevel(level + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{item.name}</Text>
            </View>
          );
        }}
      />
      <View
        style={{ marginBottom: 20, backgroundColor: "blue", borderRadius: 10 }}
      >
        <Button onPress={dropTable} title="Delete Table" color="white" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "beige",
  },
  block: {
    height: 70,
  },
});
