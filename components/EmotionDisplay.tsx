import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Emotion from "./Emotion";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Dimensions } from "react-native";

interface Props {
  level: number;
  data: EmotionType[];
  currentEmotion: EmotionType;
  passHandleButtonClickToParent: (item: EmotionType) => void;
  handleCreateLog: (data: string[]) => void;
}

type EmotionType = {
  name: string;
  parent: string | null;
  color: string;
};

const EmotionDisplay = ({
  level,
  data,
  currentEmotion,
  passHandleButtonClickToParent,
  handleCreateLog,
}: Props) => {
  const [isLoading, setLoading] = useState(true),
    [root, setRoot] = useState<string>(""),
    [need, setNeed] = useState<string>(""),
    [extra, setExtra] = useState<string>("");

  const getEntries = () => {
    return [root, need, extra];
  };

  const height = Dimensions.get("window").height;

  // Emotion selection
  if (level < 4) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          borderColor: "red",
          marginTop: 20,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            contentContainerStyle={{
              // alignItems: "center",
              // justifyContent: "center",
              flex: 1,
              paddingBottom: 30,
            }}
            scrollEnabled={false}
            numColumns={2}
            data={data}
            renderItem={({ item }) => {
              return (
                <Emotion
                  name={item["name"]}
                  color={item["color"]}
                  onClick={() => {
                    passHandleButtonClickToParent(item);
                  }}
                />
              );
            }}
          />
        </ScrollView>
      </View>
    );

    // Journal part
  } else {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: 20,
            flex: 1,
            minWidth: 320,
            gap: 20,
            justifyContent: "space-between",
            paddingBottom: 40,
          }}
        >
          <View>
            <Text style={{ fontSize: 18 }}>
              When did you start feeling{" "}
              {String(currentEmotion.name).charAt(0).toLowerCase() +
                String(currentEmotion.name).slice(1)}
              ?
            </Text>
            <TextInput
              multiline={true}
              numberOfLines={10}
              placeholder={"Type here..."}
              placeholderTextColor="#555"
              onChangeText={(root) => setRoot(root.trim())}
              style={{
                minHeight: 60,
                height: "auto",
                padding: 10,
                marginTop: 6,
                fontSize: 16,
                borderRadius: 10,
                backgroundColor: currentEmotion.color,
              }}
            />
          </View>
          <View>
            <Text style={{ marginTop: 10, fontSize: 18 }}>
              What do you need in this moment?
            </Text>
            <TextInput
              multiline={true}
              numberOfLines={10}
              placeholder={"Type here..."}
              placeholderTextColor="#555"
              onChangeText={(need) => setNeed(need.trim())}
              style={{
                minHeight: 80,
                height: "auto",
                padding: 10,
                marginTop: 6,
                fontSize: 16,
                borderRadius: 10,
                backgroundColor: currentEmotion.color,
              }}
            />
          </View>
          <View>
            <Text style={{ marginTop: 10, fontSize: 16 }}>Anything else?</Text>
            <TextInput
              multiline={true}
              numberOfLines={10}
              placeholder={"Type here..."}
              placeholderTextColor="#555"
              onChangeText={(extra) => setExtra(extra.trim())}
              style={{
                minHeight: 90,
                height: "auto",
                padding: 10,
                marginTop: 6,
                fontSize: 16,
                borderRadius: 10,
                backgroundColor: currentEmotion.color,
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                const entries = getEntries();
                handleCreateLog(entries);
              }}
              style={{
                marginTop: 4,
                paddingHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                height: 60,
                backgroundColor: "#e3d7b7",
                borderRadius: 20,
              }}
            >
              <AntDesign name="arrowright" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // OLD
  // switch (level) {
  //   case 0:
  //     return (
  //       <View style={styles.start}>
  //         <Text style={styles.startText}>Add a new emotion:</Text>
  //         <View style={styles.button}>
  //           <Button onPress={onStart} title="+" color="black" />
  //         </View>
  //       </View>
  //     );
  //   case 2:
  //     if (url === emotionTable) {
  //       console.log("url = emotionTable");
  //       setUrl(emotionTable + "/" + currentEmotion);
  //     }
  //     break;
  //   case 3:
  //     if (url === emotionTable + "/" + url.search(/./)) {
  //       setUrl(emotionTable + "/" + currentEmotion);
  //     }
  //     break;
  //   default:
  //     break;
  // }

  // return (
  //   <View style={styles.emotionContainer}>
  //     {isLoading ? (
  //       <ActivityIndicator />
  //     ) : (
  //       data.map((emotion) => {
  //         return (
  //           <Emotion
  //             key={emotion["id"]}
  //             onClick={onClick2}
  //             name={emotion["name"]}
  //             color="green"
  //           />
  //         );
  //       })
  //     )}
  //   </View>
  // );
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
