import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BodyDrawing from "@/components/BodyDrawing";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import BodyDisplay from "@/components/BodyDisplay";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

const { width, height } = Dimensions.get("window");

export default function logModal() {
  const logData = useLocalSearchParams();

  const router = useRouter();
  return (
    <View style={{ backgroundColor: String(logData.color) }}>
      <SafeAreaView>
        {/* Title & Exit button */}
        <View
          style={{
            paddingTop: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
          }}
        >
          <View
            style={{
              position: "sticky",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <AntDesign name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              {logData.emotion}
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log("editing");
              }}
              style={{ marginRight: 10 }}
            >
              <MaterialIcons name="mode-edit-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Details */}
        <ScrollView>
          <View
            style={{
              paddingBottom: 100,
              paddingTop: 10,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              {logData.root.length > 0 && (
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={[
                      styles.emotionDetailTitle,
                      {
                        width: 50,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      },
                    ]}
                  >
                    Cause
                  </Text>
                  <Text
                    style={{
                      marginBottom: 6,
                      paddingHorizontal: 4,
                    }}
                  >
                    {logData.root}
                  </Text>
                </View>
              )}
              {logData.need.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text
                    style={[
                      styles.emotionDetailTitle,
                      {
                        width: 44,
                        backgroundColor: "rgba(0, 0, 0, 0.17)",
                      },
                    ]}
                  >
                    Need
                  </Text>
                  <Text
                    style={{
                      marginBottom: 6,
                      paddingHorizontal: 4,
                    }}
                  >
                    {logData.need}
                  </Text>
                </View>
              )}
              {logData.extra.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text
                    style={[
                      styles.emotionDetailTitle,
                      {
                        width: 42,
                        backgroundColor: "rgba(0, 0, 0, 0.23)",
                      },
                    ]}
                  >
                    Diary
                  </Text>
                  <Text
                    style={{
                      marginBottom: 6,
                      paddingHorizontal: 4,
                    }}
                  >
                    {logData.extra}
                  </Text>
                </View>
              )}
            </View>
            {/* Body */}
            <BodyDisplay />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// export default logModal;

const styles = StyleSheet.create({
  emotionDetailTitle: {
    borderRadius: 30,
    marginBottom: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
