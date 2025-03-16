import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Emotion from "./Emotion";
import axios from "axios";

const backend: string = "http://192.168.1.51:8000";
const emotionTable: string = backend + "/emotions";

interface Props {
  level: number;
  // children: ReactNode;
  onStart: () => void;
  onClick2: (name: string) => void;
  currentEmotion: string;
}

type Emotion = {
  id: number;
  name: string;
  level: number;
  parent: string;
};

const EmotionDisplay = ({
  level,
  onClick2,
  onStart,
  currentEmotion,
}: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Emotion[]>([]);
  const [url, setUrl] = useState(emotionTable);

  const getEmotions = async () => {
    try {
      const response = await axios.get(url);
      setData(response.data);
      console.log("data is set!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmotions();
    console.log("useEffect called!");
  }, []);

  switch (level) {
    case 0:
      return (
        <View style={styles.start}>
          <Text style={styles.startText}>Add a new emotion:</Text>
          <View style={styles.button}>
            <Button onPress={onStart} title="+" color="black" />
          </View>
        </View>
      );
    case 2:
      if (url === emotionTable) {
        console.log("url = emotionTable");
        setUrl(emotionTable + "/" + currentEmotion);
      }
      break;
    case 3:
      if (url === emotionTable + "/" + url.search(/./)) {
        setUrl(emotionTable + "/" + currentEmotion);
      }
      break;
    default:
      break;
  }

  return (
    <View style={styles.emotionContainer}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        data.map((emotion) => {
          return (
            <Emotion
              key={emotion["id"]}
              onClick={onClick2}
              name={emotion["name"]}
              color="green"
            />
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emotionContainer: {
    flex: 1,
    width: 170,
    height: 70,
    gap: 10,
  },
  start: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startText: {
    fontSize: 20,
  },
  button: {
    marginTop: 50,
    backgroundColor: "lightgreen",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default EmotionDisplay;
