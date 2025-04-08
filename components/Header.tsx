import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, useRouter } from "expo-router";

interface Props {
  level: number;
  handleGoBack: () => void;
  color: string;
  name: string;
}

const Header = ({ level, handleGoBack, color, name }: Props) => {
  const router = useRouter();

  if (level === 1) {
    return (
      <View
        style={{
          flexDirection: "row",
          // justifyContent: "space-around",
          alignItems: "center",
          width: 380,
          height: 40,
          marginTop: 10,
          // backgroundColor: "#e3d7b7",
          borderRadius: 20,
        }}
      >
        <TouchableOpacity onPress={handleGoBack} style={{ marginLeft: 20 }}>
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 28, marginLeft: 20 }}>
          How are you feeling?
        </Text>
      </View>
    );
  } else if (level > 3) {
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
          // marginBottom: 10,
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
