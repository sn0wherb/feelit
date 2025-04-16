import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

interface Props {
  logData: LogType;
}

const { width, height } = Dimensions.get("window");

const logModal = ({ logData }: Props) => {
  const router = useRouter();
  return (
    <View>
      {/* Modal */}
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          elevation: 1,
          flex: 1,
          alignSelf: "center",
          margin: 30,
          width: width * 0.9,
          height: height * 0.8,
          backgroundColor: logData.color,
          borderRadius: 10,
          padding: 20,
        }}
      >
        {/* Title & time */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {logData.emotion}
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign name="close" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default logModal;

const styles = StyleSheet.create({});
