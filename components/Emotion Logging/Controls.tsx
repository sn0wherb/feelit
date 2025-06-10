import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  level: number;
  handleGoBack: () => void;
  handleSave?: () => void;
  color: string;
  name: string;
  isEditingEnabled: boolean;
  toggleEditing: (state: boolean) => void;
  custom?: boolean;
}

const { width, height } = Dimensions.get("window");

const Controls = ({
  level,
  handleGoBack,
  handleSave,
  color,
  name,
  isEditingEnabled,
  toggleEditing,
  custom = false,
}: Props) => {
  const router = useRouter();

  // Create new emotion header
  if (custom) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: width,
          height: 40,
          marginTop: 20,
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            width: 50,
            backgroundColor: "#e3d7b7",
            borderRadius: 20,
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <AntDesign name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 28, marginLeft: 16 }}>
          {level > 1 ? "Create a new type of" : "Create a new emotion"}
        </Text>
      </View>
    );
  } else if (isEditingEnabled) {
    return (
      <View
        style={{
          bottom: height * 0.06,
          left: height * 0.03,
          position: "absolute",
          zIndex: 1,
          elevation: 1,
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            width: 50,
            backgroundColor: "rgba(227, 215, 183, 0.8)",
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              toggleEditing(false);
            }}
            style={{ transform: [{ rotateY: "180deg" }] }}
          >
            <AntDesign name="close" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  switch (level) {
    case 1:
      return (
        <View
          style={{
            bottom: height * 0.06,
            left: height * 0.03,
            position: "absolute",
            zIndex: 1,
            elevation: 1,
          }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              width: 50,
              backgroundColor: "rgba(227, 215, 183, 0.8)",
              borderRadius: 30,
            }}
          >
            <TouchableOpacity
              onPress={handleGoBack}
              style={{ transform: [{ rotateY: "180deg" }] }}
            >
              <MaterialIcons name="logout" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      );
    case 2: // Fallthrough
    case 3: // Emotion selection
      return (
        <View
          style={{
            bottom: height * 0.06,
            position: "absolute",
            zIndex: 1,
            elevation: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: width,
            paddingHorizontal: 20,
          }}
        >
          {/* Back */}
          <View
            style={{
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              width: 50,
              backgroundColor: "rgba(227, 215, 183, 0.8)",
              borderRadius: 30,
            }}
          >
            <TouchableOpacity onPress={handleGoBack}>
              <AntDesign name="arrowleft" size={30} color="black" />
            </TouchableOpacity>
          </View>
          {/* Save */}
          <View
            style={{
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              height: 54,
              width: 54,
              backgroundColor: "rgba(227, 215, 183, 0.8)",
              borderRadius: 50,
            }}
          >
            <TouchableOpacity onPress={handleSave}>
              <FontAwesome6 name="check" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      );
    case 4: // Bodydrawing
      return (
        <View
          style={{
            // paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            height: 46,
            width: 46,
            backgroundColor: "#e3d7b7",
            borderRadius: 30,
            position: "absolute",
            zIndex: 1,
            top: 17,
            left: 17,
          }}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <AntDesign name="close" size={26} color="black" />
          </TouchableOpacity>
        </View>
      );
    default: // Journal
      return (
        <View
          style={{
            // paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            height: 46,
            width: 46,
            backgroundColor: "#e3d7b7",
            borderRadius: 30,
            position: "absolute",
            zIndex: 1,
            top: 17,
            left: 17,
          }}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <AntDesign name="arrowleft" size={26} color="black" />
          </TouchableOpacity>
        </View>
      );
  }
};

export default Controls;

const styles = StyleSheet.create({});
