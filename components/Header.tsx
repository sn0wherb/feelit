import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, useRouter } from "expo-router";

interface Props {
  level: number;
  handleGoBack: () => void;
  color: string;
  name: string;
  custom?: boolean;
}

const Header = ({
  level,
  handleGoBack,
  color,
  name,
  custom = false,
}: Props) => {
  const router = useRouter();

  if (custom) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: 380,
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
  }

  if (level === 1) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: 380,
          height: 60,
          marginTop: 10,
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
          How are you feeling?
        </Text>
      </View>
    );
  } else if (level > 4) {
    return (
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: 330,
          height: 60,
          marginTop: 10,
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            height: 60,
            backgroundColor: "#e3d7b7",
            borderRadius: 20,
          }}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <AntDesign name="arrowleft" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: 250,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 26 }}>{name}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: 330,
          height: 60,
          marginTop: 10,
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            height: 60,
            backgroundColor: "#e3d7b7",
            borderRadius: 20,
          }}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <AntDesign name="arrowleft" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: 250,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 26 }}>{name}</Text>
        </View>
      </View>
    );
  }
};

export default Header;

const styles = StyleSheet.create({});
