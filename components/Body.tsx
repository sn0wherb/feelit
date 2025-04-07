import {
  Button,
  Dimensions,
  GestureResponderEvent,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Svg, Path } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";

type StrokeType = [string[], string, number];

const Body = () => {
  const [paths, setPaths] = useState<StrokeType[]>([[["M0,0"], "black", 1]]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [currentSize, setCurrentSize] = useState<number>(1);

  const silhouetteImage = require("../assets/images/silhouette_front.png");

  const onTouchMove = (event: GestureResponderEvent) => {
    const newPath: string[] = [...currentPath];
    console.log(newPath);
    const locationX: number = event.nativeEvent.locationX,
      locationY: number = event.nativeEvent.locationY;

    // If this is the first point in currentPath, add svg signature M as the beginning
    const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(
      0
    )},${locationY.toFixed(0)} `;

    newPath.push(newPoint);
    setCurrentPath(newPath);
    console.log(newPath);
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
      <View
        style={styles.drawingBoard}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <ImageBackground
          source={silhouetteImage}
          imageStyle={{ tintColor: "black" }}
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
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Slider
          style={{ width: 200, height: 40, marginTop: 10 }}
          thumbTintColor="black"
          minimumTrackTintColor="#333"
          minimumValue={1}
          maximumValue={10}
          step={1}
          tapToSeek={true}
          onSlidingComplete={(value) => {
            setCurrentSize(value);
          }}
        />
        <TouchableOpacity
          style={styles.drawingOptionsButton}
          onPress={undoLastStroke}
        >
          <MaterialIcons name="undo" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Colors */}
      <View
        style={{
          margin: 10,
          flex: 1,
        }}
      >
        {/* <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "red" }}
            onPress={() => {
              setCurrentColor("red");
            }}
          />
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "blue" }}
            onPress={() => {
              setCurrentColor("blue");
            }}
          />
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "green" }}
            onPress={() => {
              setCurrentColor("green");
            }}
          />
        </View> */}
      </View>
    </View>
  );
};

export default Body;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
  },
  drawingBoard: {
    // borderWidth: 5,
    // borderColor: "rgba(0,0,0,0.1)",
    // borderRadius: 10,
    // margin: 10,
    marginTop: 10,
    height: 560,
  },
  drawingOptionsButton: {
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    padding: 4,
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
