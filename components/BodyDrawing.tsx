import {
  Button,
  Dimensions,
  GestureResponderEvent,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Svg, Path } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-assets/slider";
import ColorPicker, { HueSlider, Panel1 } from "reanimated-color-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";

type StrokeType = [string[], string, number];

const { height, width } = Dimensions.get("window");

const BodyDrawing = () => {
  // Svg states
  const [paths, setPaths] = useState<StrokeType[]>([[["M0,0"], "black", 1]]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [currentSize, setCurrentSize] = useState<number>(1);

  // Modal states
  const [isBrushSizeModalVisible, setIsBrushSizeModalVisible] = useState(false);
  const [isColorModalVisible, setIsColorModalVisible] = useState(false);

  const silhouetteImage = require("../assets/images/silhouette_front.png");

  const onTouchMove = (event: GestureResponderEvent) => {
    const newPath: string[] = [...currentPath];
    const locationX: number = event.nativeEvent.locationX,
      locationY: number = event.nativeEvent.locationY;

    // If this is the first point in currentPath, add svg signature M as the beginning
    const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(
      0
    )},${locationY.toFixed(0)} `;

    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const onTouchEnd = () => {
    const path: StrokeType = [currentPath, currentColor, currentSize];

    // Don't add invisible points
    if (path[0].length > 1) {
      paths.push(path);
    }
    setCurrentPath([]);
  };

  const undoLastStroke = () => {
    let newPaths = [...paths];
    if (newPaths.length > 1) {
      newPaths.pop();
      setPaths(newPaths);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginTop: 16, textAlign: "center" }}>
        Where do you feel it?
      </Text>
      {/* Drawing */}
      <View
        style={styles.drawingBoard}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <ImageBackground
          source={silhouetteImage}
          imageStyle={{ tintColor: "black", resizeMode: "contain" }}
        >
          <Svg>
            {/* previous strokes */}
            {paths.map((item, index) => {
              return (
                <Path
                  key={`paths-${index}`}
                  d={item[0].join("")}
                  stroke={item[1]}
                  fill="transparent"
                  strokeWidth={item[2]}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            {/* current stroke */}
            {paths.map((item, index) => {
              return (
                <Path
                  key={`path-${index}`}
                  d={currentPath.join("")}
                  stroke={currentColor}
                  fill="transparent"
                  strokeWidth={currentSize}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </Svg>
        </ImageBackground>
      </View>
      {/* Drawing controls */}
      <View style={{ display: "flex" }}>
        {/* Brush modal */}
        {isBrushSizeModalVisible && (
          <View style={[styles.drawingOptionModal, { height: height * 0.1 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Slider
                value={currentSize}
                style={{ width: 200 }}
                thumbTintColor="black"
                minimumTrackTintColor="#333"
                minimumValue={1}
                maximumValue={10}
                step={1}
                onValueChange={(value) => {
                  setCurrentSize(value);
                }}
                // onSlidingComplete={(value) => {
                //   setCurrentSize(value);
                // }}
              />
              <Octicons name="dot-fill" size={currentSize * 4} color="black" />
              <TouchableOpacity
                onPress={() => {
                  setIsBrushSizeModalVisible(false);
                }}
              >
                <AntDesign name="close" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* Color modal */}
        {isColorModalVisible && (
          <View style={[styles.drawingOptionModal, { height: height * 0.4 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <ColorPicker
                  style={{
                    width: width * 0.66,
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                  value={currentColor}
                  onCompleteJS={(value) => {
                    setCurrentColor(value.hex);
                  }}
                  boundedThumb
                >
                  <Panel1
                    style={{
                      height: height * 0.34,
                      width: height * 0.34,
                      marginRight: 16,
                    }}
                  />
                  <HueSlider
                    vertical
                    sliderThickness={48}
                    thumbColor="interactive"
                    style={{ height: height * 0.28 }}
                  />
                </ColorPicker>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsColorModalVisible(false);
                }}
                style={{ height: height * 0.05 }}
              >
<<<<<<< HEAD
=======
                {/* <AntDesign name="close" size={30} color="black" /> */}
>>>>>>> 9f9ee28de9f3d860fcb80ba6258e4f446318ae9a
                <AntDesign
                  name="close"
                  size={30}
                  color="black"
                  style={{ marginRight: width * 0.01 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 12,
          }}
        >
          {/* Brush size */}
          <TouchableOpacity
            style={styles.drawingOptionsButton}
            onPress={() => {
              setIsBrushSizeModalVisible(true);
            }}
          >
            <MaterialCommunityIcons name="pencil" size={28} color="black" />
          </TouchableOpacity>

          {/* Color */}
          <TouchableOpacity
            style={styles.drawingOptionsButton}
            onPress={() => {
              setIsColorModalVisible(true);
            }}
          >
            <MaterialIcons name="color-lens" size={28} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawingOptionsButton}
            onPress={undoLastStroke}
          >
            <MaterialIcons name="undo" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BodyDrawing;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "white",
  },
  drawingOptionModal: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 16,
    paddingHorizontal: 18,
    width: width * 0.86,
    position: "absolute",
    bottom: 10,
    zIndex: 1,
    elevation: 1,
    alignSelf: "center",
    backgroundColor: "#cbb19e",
  },
  drawingBoard: {
    // borderWidth: 5,
    // borderColor: "rgba(0,0,0,0.1)",
    // borderRadius: 10,
    // margin: 10,
    height: height * 0.6,
  },
  drawingOptionsButton: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    padding: 4,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
