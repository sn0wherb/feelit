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
import React, { memo, useCallback, useState } from "react";
import { Svg, Path, Circle } from "react-native-svg";
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
  emotion?: EmotionType;
  size?: number;
}

const { height, width } = Dimensions.get("window");

const BodyDataCompilation = ({ logId, emotion, size = 0.76 }: Props) => {
  // Svg states
  const [paths, setPaths] = useState<StrokeType[]>([[["M0,0"], "black", 1]]),
    [svgData, setSvgData] = useState<SvgDataType[]>([]);
  const [gridVisualized, setGridVisualized] = useState<number[][]>([]);
  const [grid, setGrid] = useState<[[number, string]][]>([]);

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
    const children = await getChildrenEmotions(emotion);
    let logQuery = "";
    if (children) {
      children?.forEach((value, index) => {
        if (index == children.length - 1) {
          logQuery += `emotion = '${value}'`;
        } else {
          logQuery += `emotion = '${value}' OR `;
        }
      });
    } else {
      logQuery = `emotion = '${emotion?.name}'`;
    }

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
        compileBodyDisplayData(strokeData);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getCustomChildrenEmotions = async (emotion: EmotionType) => {
    try {
      const data = await db.getAllAsync<EmotionType>(
        `SELECT * FROM emotions WHERE parent = '${emotion.name}'`
      );
      if (data.length > 0) {
        data.forEach((value) => {
          return getCustomChildrenEmotions(value);
        })
      }
    } catch (e) {
      console.error(e);
    }
  }

  const getChildrenEmotions = (emotion: EmotionType) => {
    if (emotion.isCustom) {
      return getCustomChildrenEmotions(emotion);
    }

    let children: string[] = [];
    const secondLvl: EmotionType[] = Object.values(
      stockEmotionData[2][emotion.name]
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

  // 
  // SET GRID SECTION AMOUNT HERE
  // 
  const gridSections = 20;
  const strokeMultiplier = gridSections / 20;
  const gridIncrementX = width / gridSections;
  const gridIncrementY = (height * size) / gridSections;

  const compileBodyDisplayData = (data: StrokeType[]) => {
    // console.log(data);
    // Create grid
    const createGrid = (rows: number, columns: number = rows) => {
      let grid: [[number, string]][] = [];

      // Rows
      for (let i = 0; i < rows; i++) {
        // @ts-expect-error
        grid.push([]);
        // Columns
        for (let j = 0; j < columns; j++) {
          grid[i].push([0, "black"]);
        }
      }
      return grid;
    };

    const gridData = createGrid(gridSections);

    // Gridlines
    let gridTemp = gridVisualized;
    for (let i = 0; i < gridSections; i++) {
      gridTemp.push([gridIncrementX * i, gridIncrementY * i]);
    }
    setGridVisualized(gridTemp);

    const regExAll = /\d{1,}/g; // Regex that matches the digits in svg stroke strings

    // Locate stroke in gridData
    const locate = (point: number, axis: "x" | "y", start: number = 0, end: number = gridSections - 1) => {
      if (start >= end) return start;
      
      const mid = Math.floor((start + end) / 2);
      const midPoint = mid * (axis === "x" ? gridIncrementX : gridIncrementY);
      
      if (point >= midPoint && point < midPoint + (axis === "x" ? gridIncrementX : gridIncrementY)) {
        return mid;
      }
      
      if (point < midPoint) {
        return locate(point, axis, start, mid);
      } else {
        return locate(point, axis, mid + 1, end);
      }
    };

    // Go through all paths
    for (let i = 0; i < data.length; i++) {
      // Go through all points in this path
      for (let j = 0; j < data[i][0].length; j++) {
        const stroke = data[i][0][j];
        const pointsStrings = [...stroke.matchAll(regExAll)];
        const points = [Number(pointsStrings[0]), Number(pointsStrings[1])];

        const x = locate(points[0], 'x');
        const y = locate(points[1], 'y');
        gridData[x][y][0]++;
        gridData[x][y][1] = data[i][1];
      }
    }
    setGrid(gridData);
  };

  // console.log(grid);

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
            {/* {paths.map((item, index) => {
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
            })} */}
            {/* grid lines */}
            {/* {gridVisualized.map((item, index) => {
              return (
                <Path
                  key={`grid-${index}`}
                  d={`M${item[0]},0 ${item[0]},${height * size} M0,${item[1]} ${width},${item[1]}`}
                  stroke={"black"}
                  strokeWidth={3}
                />
              )
            })} */}
            {/* Compiled data */}
            {grid.map((item, index) => {
              const x = index;
              return (
                item.map((item, index) => {
                  // console.log(item);
                  return (
                    <Circle
                      key={`grid-${index}`}
                      cx={x * gridIncrementX + gridIncrementX / 2}
                      cy={index * gridIncrementY + gridIncrementY / 2}
                      r={item[0] * strokeMultiplier}
                      fill={item[1]}
                      opacity={0.5}
                    />
                  );
                })
              )
            })}
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
