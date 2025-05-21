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
  size?: number;
}

const { height, width } = Dimensions.get("window");

const BodyDataCompilation = ({ logId, emotion, size = 0.76 }: Props) => {
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
      console.log(strokeData);
      compileBodyDisplayData(strokeData);

      // Get biggest difference
      // let biggest = 0;
      // for (let i = 0; i < strokeData.length; i++) {
      //   let sum = 0;
      //   for (let j = 1; j < strokeData[i][0].length; j++) {
      //     const regex = /\d{3}/;
      //     if (
      //       regex.exec(strokeData[i][0][j]) &&
      //       regex.exec(strokeData[i][0][j - 1])
      //     ) {
      //       const match1 = Number(regex.exec(strokeData[i][0][j])[0]);
      //       const match2 = Number(regex.exec(strokeData[i][0][j - 1])[0]);
      //       // console.log(match1, match2);
      //       if (match1 - match2 > 0) {
      //         sum += match1 - match2;
      //         // if (match1 - match2 > biggest) {
      //         //   console.log(match1 - match2);
      //         //   biggest = match1 - match2;
      //         // }
      //       } else {
      //         sum += match2 - match1;
      //         // if (match2 - match1 > biggest) {
      //         //   console.log(match2 - match1);
      //         //   biggest = match2 - match1;
      //         // }
      //       }
      //     }
      //   }
      //   let average = sum / strokeData[i][0].length;
      //   // console.log(average);
      // }

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

  const compileBodyDisplayData = (data: StrokeType[]) => {
    // Create grid
    const createGrid = (rows: number, columns: number) => {
      let grid = [];

      // Rows
      for (let i = 0; i < rows; i++) {
        grid.push([]);
        // Columns
        for (let j = 0; j < columns; j++) {
          // @ts-expect-error
          grid[i].push(0);
        }
      }
      return grid;
    };

    const gridSections = 5;

    const gridIncrementX = width / gridSections;
    const gridIncrementY = (height * size) / gridSections;
    const grid = createGrid(gridSections, gridSections);
    const regExAll = /\d{1,}/g; // Regex that matches the digits in svg stroke strings
    let length = [];
    // Go through all paths
    for (let i = 0; i < data.length; i++) {
      // Go through all points in this path
      console.log(data[i][0].length);
      for (let j = 0; j < data[i][0].length; j++) {
        const stroke = data[i][0][j];
        const pointsStrings = [...stroke.matchAll(regExAll)];
        const points = [Number(pointsStrings[0]), Number(pointsStrings[1])];

        // Locate stroke in grid
        // prettier-ignore

        // horizontal recursive
        const locateHorizontally = (
          x: number,
          index: number = gridSections
        ) => {
          const middleIndex = index % 2 == 0
            ? index / 2
            : (index - 1) / 2
          const middle = middleIndex * gridIncrementX;
          // Breakout statement
          if (
            (x > middle && x < middle + gridIncrementX) ||
            x == middleIndex ||
            (x < middle && x > middle - gridIncrementX)
          ) {
            // Return index of row
            return middleIndex;
          }
          // console.log("middleIndex: " + middleIndex);
          // console.log("x: " + x);

          // Recursive statements
          if (x > middleIndex) {
            return locateHorizontally(x, middleIndex);
          } else {
            return locateHorizontally(x, middleIndex);
          }
        };

        console.log("original: " + points[0]);
        const x = locateHorizontally(points[0]);
        console.log(x);
        length.push(x);

        // horizontal
        // switch (true) {
        //   case points[0] >= 150:
        //     x = 1;
        //     break;
        //   default:
        //     x = 0;
        // }

        // // vertical
        // switch (true) {
        //   case points[1] >= 250:
        //     y = 1;
        //     break;
        //   default:
        //     y = 0;
        // }

        // grid[x][y]++;

        // console.log(grid);
      }
    }
    console.log(length.length);
  };

  const renderSvgs = () => {
    for (let i = 0; i <= 20; i++) {
      return (
        <Path
          d={`M${(width / 20) * i},0 ${(width / 20) * i},${height * size}`}
          stroke={"black"}
          strokeWidth={5}
        />
      );
    }
  };

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
                  // opacity={0.7}
                  fill="transparent"
                  strokeWidth={item[2]}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            {renderSvgs()}
            <Path d={"M0,0"} stroke={"black"} strokeWidth={5} />
          </Svg>
        </ImageBackground>
      </View>
    </View>
  );
};

export default BodyDataCompilation;

const styles = StyleSheet.create({
  drawingBoard: {
    height: height * 0.76,
  },
});
