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
  Touchable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Emotion from "./Emotion";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Dimensions } from "react-native";
import BodyDrawing from "./BodyDrawing";
import { useGlobalSearchParams, useRouter } from "expo-router";

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
  level: number;
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

  const router = useRouter();
  const params = useGlobalSearchParams<{ level: string }>();

  // Custom emotion button
  const newCustomEmotion = () => {
    const params = currentEmotion
      ? { level: level, name: currentEmotion.name, color: currentEmotion.color }
      : { level: level };
    router.push({
      pathname: "/newCustomEmotion",
      params: params,
    });
  };

  const getEntries = () => {
    return [root, need, extra];
  };

  const height = Dimensions.get("window").height;

  // Add a placeholder +1 item at the end, in the place of which a button to create a new emotion will be placed
  data = [...data, data[0]];

  // Emotion selection
  switch (level) {
    case 1: // Fallthrough
    case 2: // Fallthrough
    case 3:
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: "red",
            marginTop: 10,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <FlatList
              contentContainerStyle={{
                // alignItems: "center",
                // justifyContent: "center",
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
              }}
              scrollEnabled={false}
              numColumns={2}
              data={data}
              renderItem={({ index, item }) => {
                // If hit last, previously inserted placeholder item, return button to create new emotion
                if (index == data.length - 1) {
                  return (
                    <View
                      style={{
                        width: 134,
                        height: 134,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 10,
                        marginHorizontal: 14,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          borderRadius: 100,
                          backgroundColor: "rgba(0,0,0,0.1)",
                          height: 90,
                          width: 90,
                          margin: 10,

                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={newCustomEmotion}
                      >
                        <AntDesign name="plus" size={28} color={"black"} />
                      </TouchableOpacity>
                    </View>
                  );
                }
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
      break;
    case 4:
      return (
        <View>
          <BodyDrawing />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 16,
                width: 320,
                paddingHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                height: 60,
                backgroundColor: "#e3d7b7",
                borderRadius: 20,
              }}
              onPress={() => {
                passHandleButtonClickToParent(currentEmotion);
              }}
            >
              <Text style={{ fontSize: 24 }}>Next</Text>
              <AntDesign name="arrowright" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      );
      break;
    default:
      return (
        <View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginTop: 20,
                flex: 1,
                gap: 20,
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 40,
              }}
            >
              <View>
                <Text style={{ fontSize: 20 }}>
                  Why do you feel{" "}
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
                    width: 320,
                    minHeight: 60,
                    height: "auto",
                    padding: 10,
                    marginTop: 6,
                    fontSize: 16,
                    borderRadius: 10,
                    backgroundColor: currentEmotion.color,
                    // Shadow
                    shadowColor: currentEmotion.color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
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
                    width: 320,
                    minHeight: 80,
                    height: "auto",
                    padding: 10,
                    marginTop: 6,
                    fontSize: 16,
                    borderRadius: 10,
                    backgroundColor: currentEmotion.color,
                    // Shadow
                    shadowColor: currentEmotion.color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                  }}
                />
              </View>
              <View>
                <Text style={{ marginTop: 10, fontSize: 16 }}>
                  Anything else?
                </Text>
                <TextInput
                  multiline={true}
                  numberOfLines={10}
                  placeholder={"Type here..."}
                  placeholderTextColor="#555"
                  onChangeText={(extra) => setExtra(extra.trim())}
                  style={{
                    width: 320,
                    minHeight: 90,
                    height: "auto",
                    padding: 10,
                    marginTop: 6,
                    fontSize: 16,
                    borderRadius: 10,
                    backgroundColor: currentEmotion.color,
                    // Shadow
                    shadowColor: currentEmotion.color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  const entries = getEntries();
                  handleCreateLog(entries);
                }}
                style={{
                  flexDirection: "row",
                  gap: 16,
                  width: 320,
                  paddingHorizontal: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 60,
                  backgroundColor: "#e3d7b7",
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 24 }}>Save</Text>
                <AntDesign name="arrowright" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
      break;
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
