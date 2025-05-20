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
import React, { useCallback, useState } from "react";
import { Svg, Path } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-assets/slider";
import ColorPicker, { HueSlider, Panel1 } from "reanimated-color-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";

type StrokeType = [string[], string, number];

type SvgDataType = {
  id: number;
  path: string;
  color: string;
  size: number;
};

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

type EmotionType = {
  id: number;
  name: string;
  parent: string | null;
  color: string;
  level: number;
  isCustom: number;
};

interface Props {
  logId?: number;
  emotion?: string;
  size: number;
}

const { height, width } = Dimensions.get("window");

const BodyDisplay = ({ logId, emotion, size = 0.76 }: Props) => {
  // Svg states
  const [paths, setPaths] = useState<StrokeType[]>([[["M0,0"], "black", 1]]),
    [svgData, setSvgData] = useState<SvgDataType[]>([]);

  const silhouetteImage = require("../assets/images/silhouette_front.png");
  const {
    stockEmotionData,
  } = require("@/assets/data/emotions/stockEmotionData");

  const db = useSQLiteContext();

  const getData = async () => {
    try {
      const data = await db.getAllAsync<SvgDataType>(
        "SELECT * FROM bodydrawing_svg_paths WHERE id = ?",
        // @ts-expect-error
        [logId]
      );
      let strokeData: StrokeType[] = [];
      data.forEach((value) => {
        const svgArray = value.path.split("/");
        strokeData.push([svgArray, value.color, value.size]);
      });
      setPaths(strokeData);
    } catch (e) {
      console.error(e);
    }
  };

  const getAllData = async () => {
    // @ts-expect-error
    const children = getChildrenEmotions(emotion);
    let logQuery = "";
    children.forEach((value, index) => {
      if (index == children.length - 1) {
        logQuery += `emotion = '${value}'`;
      } else {
        logQuery += `emotion = '${value}' OR `;
      }
    });

    // Get all logs under this base emotion and its child emotions
    try {
      const data = await db.getAllAsync<LogType>(
        `SELECT * FROM emotion_logs WHERE ${logQuery}`
      );

      // Create query for getting all body drawing svgs from these logs
      let logIdQuery = "id = ";
      data.forEach((log, index) => {
        index == data.length - 1
          ? (logIdQuery += `${log.id}`)
          : (logIdQuery += `${log.id} OR id = `);
      });

      // Get those svgs
      try {
        const data = await db.getAllAsync<SvgDataType>(
          `SELECT * FROM bodydrawing_svg_paths WHERE ${logIdQuery}`
        );
        let strokeData: StrokeType[] = [];
        data.forEach((value) => {
          const svgArray = value.path.split("/");
          strokeData.push([svgArray, value.color, value.size]);
        });
        setPaths(strokeData);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getChildrenEmotions = (emotion: string) => {
    let children: string[] = [];
    const secondLvl: EmotionType[] = Object.values(
      stockEmotionData[2][emotion]
    );
    secondLvl.forEach((secondLvlEmotion) => {
      children.push(secondLvlEmotion.name);
      const thirdLvl: EmotionType[] = Object.values(
        stockEmotionData[3][secondLvlEmotion.name]
      );
      thirdLvl.forEach((thirdLvlEmotion) => {
        children.push(thirdLvlEmotion.name);
      });
    });
    return children;
  };

  useFocusEffect(
    useCallback(() => {
      if (emotion) {
        getAllData();
      } else {
        logId && getData();
      }
    }, [])
  );

  return (
    <View>
      {/* Drawing */}
      <View style={{ height: height * size }}>
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
                  opacity={0.7}
                  fill="transparent"
                  strokeWidth={item[2]}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </Svg>
        </ImageBackground>
      </View>
    </View>
  );
};

export default BodyDisplay;

const styles = StyleSheet.create({
  drawingBoard: {
    height: height * 0.76,
  },
});
