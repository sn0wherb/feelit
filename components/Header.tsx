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

interface Props {
  level: number;
  handleGoBack: () => void;
  handleSave?: () => void;
  color: string;
  name: string;
  custom?: boolean;
}

const { width, height } = Dimensions.get("window");

const Header = ({
  level,
  handleGoBack,
  handleSave,
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
  }

  if (level === 1) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: width,
          height: 60,
          marginTop: 10,
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            height: 52,
            width: 52,
            backgroundColor: "#e3d7b7",
            borderRadius: 30,
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
  } else if (level > 3) {
    return (
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: width,
          height: 60,
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            height: 52,
            width: 52,
            backgroundColor: "#e3d7b7",
            borderRadius: 30,
          }}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <AntDesign name="arrowleft" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: 14,
            flex: 1,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color,
            borderRadius: 30,
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
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
          width: width,
          height: 60,
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        {/* Back */}
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            height: 52,
            width: 52,
            backgroundColor: "#e3d7b7",
            borderRadius: 30,
          }}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <AntDesign name="arrowleft" size={32} color="black" />
          </TouchableOpacity>
        </View>

        {/* Current emotion */}
        <View
          style={{
<<<<<<< HEAD
            width: 190,
=======
            marginHorizontal: 14,
            paddingLeft: 10,
            // paddingRight: 2,
>>>>>>> 9f9ee28de9f3d860fcb80ba6258e4f446318ae9a
            height: 60,
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: color,
            borderRadius: 50,
            // borderBottomLeftRadius: 20,
            // borderTopLeftRadius: 20,
            // borderBottomRightRadius: 30,
            // borderTopRightRadius: 30,
          }}
        >
          <Text style={{ fontSize: 26, paddingLeft: 8, paddingRight: 10 }}>
            {name}
          </Text>
          {/* Save */}
          <View
            style={{
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              height: 60,
              width: 60,
              // backgroundColor: "rgba(0,0,0,0.12)",
              backgroundColor: "#e3d7b7",
              // borderWidth: 3,
              borderRadius: 50,
              // shadowColor: color,
              // shadowOffset: { width: 0, height: 0 },
              // shadowOpacity: 0.8,
              // shadowRadius: 10,
            }}
          >
            <TouchableOpacity onPress={handleSave}>
              <FontAwesome6 name="check" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
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
          <TouchableOpacity onPress={handleSave}>
            <AntDesign name="save" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default Header;

const styles = StyleSheet.create({});
