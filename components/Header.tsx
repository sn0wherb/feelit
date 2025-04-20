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
  }

  switch (level) {
    case 1:
      return (
        <View
          style={{
            top: height * 0.02,
            position: "absolute",
            zIndex: 1,
            elevation: 1,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
                height: 46,
                width: 46,
                backgroundColor: "#e3d7b7",
                borderRadius: 30,
                marginRight: 10,
              }}
            >
              <TouchableOpacity onPress={handleGoBack}>
                <AntDesign name="close" size={26} color="black" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: "#dcdcc5",
                borderRadius: 50,
                paddingHorizontal: 20,
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24 }}>How are you feeling?</Text>
            </View>
          </View>
        </View>
      );
    case 2: // Fallthrough
    case 3: // Emotion selection
      return (
        <View
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
            width: width,
            paddingVertical: 10,
            // top: 10,
            position: "absolute",
            zIndex: 1,
            elevation: 1,
            paddingHorizontal: 20,
          }}
        >
          {/* Back */}
          <View
            style={{
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              height: 46,
              width: 46,
              backgroundColor: "#e3d7b7",
              borderRadius: 30,
            }}
          >
            <TouchableOpacity onPress={handleGoBack}>
              <AntDesign name="arrowleft" size={26} color="black" />
            </TouchableOpacity>
          </View>

          {/* Current emotion */}
          <View
            style={{
              marginHorizontal: 14,
              // paddingRight: 2,
              height: 60,
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: color,
              borderRadius: 50,
              // borderBottomLeftRadius: 20,
              // borderTopLeftRadius: 20,
              // borderBottomRightRadius: 30,
              // borderTopRightRadius: 30,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                paddingLeft: 8,
                paddingRight: 10,
              }}
            >
              {name}
            </Text>
          </View>
          {/* Save */}
          <View
            style={{
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              height: 48,
              width: 48,
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
              <FontAwesome6 name="check" size={26} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      );
    case 4: // Bodydrawing
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
              height: 46,
              width: 46,
              backgroundColor: "#e3d7b7",
              borderRadius: 30,
            }}
          >
            <TouchableOpacity onPress={handleGoBack}>
              <AntDesign name="close" size={26} color="black" />
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
            <Text style={{ fontSize: 24 }}>Where do you feel it?</Text>
          </View>
        </View>
      );
    default: // Journal
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
              height: 46,
              width: 46,
              backgroundColor: "#e3d7b7",
              borderRadius: 30,
            }}
          >
            <TouchableOpacity onPress={handleGoBack}>
              <AntDesign name="arrowleft" size={26} color="black" />
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
            <Text style={{ fontSize: 26 }}>Journal</Text>
          </View>
        </View>
      );
  }
};

export default Header;

const styles = StyleSheet.create({});
