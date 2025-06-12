import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

interface Props {
  level: number;
  handleGoBack: () => void;
  color: string;
  name: string;
  isEditingEnabled?: boolean;
  custom?: boolean;
  type?: "person" | "place" | "emotion";
}

const { width } = Dimensions.get("window");

const Header = ({
  level,
  handleGoBack,
  isEditingEnabled,
  color,
  name,
  custom = false,
  type = "emotion",
}: Props) => {
  // Create person header
  if (type === "person") {
    return (
      <View
        style={{
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
        <Text style={{ fontSize: 28, marginLeft: 16 }}>Add new person</Text>
      </View>
    );
  }

  // Create new emotion header
  if (custom) {
    return (
      <View
        style={{
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
        <Text style={{ fontSize: 28, marginLeft: 16 }}>
          {level > 1 ? `New type of ` : "New emotion"}
          <Text style={{ color: color }}>{name}</Text>
        </Text>
      </View>
    );
  } else if (isEditingEnabled) {
    return (
      <View
        style={{
          width: width,
          paddingVertical: 10,
          position: "absolute",
          zIndex: 1,
          elevation: 1,
          paddingHorizontal: 20,
        }}
      >
        {/* Current emotion */}
        <View
          style={{
            marginHorizontal: 14,
            height: 60,
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color ? color : "rgba(227, 215, 183, 0.8)",
            borderRadius: 50,
          }}
        >
          <Text
            style={{
              fontSize: 28,
            }}
          >
            Edit emotions
          </Text>
        </View>
      </View>
    );
  }

  switch (level) {
    case 1:
      return (
        <View
          style={{
            width: width,
            paddingVertical: 10,
            position: "absolute",
            zIndex: 1,
            elevation: 1,
            alignSelf: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginHorizontal: 14,
              backgroundColor: "rgba(227, 215, 183, 0.8)",
              borderRadius: 50,
              paddingHorizontal: 20,
              height: 60,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 28 }}>How are you feeling?</Text>
          </View>
        </View>
      );
    case 2: // Fallthrough
    case 3: // Emotion selection
      return (
        <View
          style={{
            width: width,
            paddingVertical: 10,
            position: "absolute",
            zIndex: 1,
            elevation: 1,
            paddingHorizontal: 20,
          }}
        >
          {/* Current emotion */}
          <View
            style={{
              marginHorizontal: 14,
              height: 60,
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: color,
              borderRadius: 50,
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
        </View>
      );
    case 4: // Bodydrawing
      return (
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            height: 60,
            marginTop: 10,
          }}
        >
          <View
            style={{
              marginRight: 34,
              width: width * 0.7,
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
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            height: 60,
            marginTop: 10,
          }}
        >
          <View
            style={{
              marginRight: 34,
              width: width * 0.7,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: color,
              borderRadius: 30,
            }}
          >
            <Text style={{ fontSize: 24 }}>Journal</Text>
          </View>
        </View>
      );
  }
};

export default Header;

const styles = StyleSheet.create({});
