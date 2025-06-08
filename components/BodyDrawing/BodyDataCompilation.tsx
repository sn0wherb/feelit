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

type GridType = [[number, string]][];

type SvgDataType = {
  id: number;
  path: string;
  color: string;
  size: number;
};

interface Props {
  logId?: number;
  emotion?: EmotionType;
  size?: number;
  setLogData: (data: LogType[]) => void;
}

const { height, width } = Dimensions.get("window");

const BodyDataCompilation = ({
  logId,
  emotion,
  size = 0.76,
  setLogData,
}: Props) => {
  // Svg states
  const [paths, setPaths] = useState<StrokeType[]>([[["M0,0"], "black", 1]]);
  const [svgData, setSvgData] = useState<SvgDataType[]>([]);
  const [gridVisualized, setGridVisualized] = useState<number[][]>([]);
  const [grid, setGrid] = useState<GridType[]>([]);

  // Display options
  const showRawData = false;
  const showGridLines = false;

  const silhouetteImage = require("@/assets/images/silhouette_front.png");
  const {
    stockEmotionData,
  } = require("@/assets/data/emotions/stockEmotionData");

  const db = useSQLiteContext();

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

      if (data.length < 1) {
        return;
      }

      setLogData(data);

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
      console.error("Error getting data", e);
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
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

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
      getAllData();
    }, [])
  );

  //
  // SET GRID SECTION AMOUNT HERE
  //
  const gridSections = 20;
  const dataOpacity = 0.4;

  const strokeMultiplier = gridSections / 10;
  const gridIncrementX = width / gridSections;
  const gridIncrementY = (height * size) / gridSections;

  // Create grid
  const createGrid = (rows: number, columns: number = rows) => {
    // [                                - rows
    //  [                               - columns
    //    [0, "black"], [0, "black"]    - points, separated by color
    //  ],
    //  [
    //    [0, "black"], [0, "black"]
    //  ]
    // ]
    let grid: GridType[] = [];

    // Rows
    for (let i = 0; i < rows; i++) {
      grid.push([]);
      // Columns
      for (let j = 0; j < columns; j++) {
        // @ts-expect-error
        grid[i].push([]);
      }
    }
    return grid;
  };

  const compileBodyDisplayData = (data: StrokeType[]) => {
    const gridData = createGrid(gridSections);

    // Gridlines
    let gridTemp = gridVisualized;
    for (let i = 0; i < gridSections; i++) {
      gridTemp.push([gridIncrementX * i, gridIncrementY * i]);
    }
    setGridVisualized(gridTemp);

    const regExAll = /\d{1,}/g; // Regex that matches the digits in svg stroke strings

    // Locate stroke in gridData
    const locate = (
      point: number,
      axis: "x" | "y",
      start: number = 0,
      end: number = gridSections - 1
    ) => {
      if (start >= end) return start;

      const mid = Math.floor((start + end) / 2);
      const midPoint = mid * (axis === "x" ? gridIncrementX : gridIncrementY);

      if (
        point >= midPoint &&
        point < midPoint + (axis === "x" ? gridIncrementX : gridIncrementY)
      ) {
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
      // Go through all points in current path
      for (let j = 0; j < data[i][0].length; j++) {
        const stroke = data[i][0][j];
        const pointsStrings = [...stroke.matchAll(regExAll)];
        const points = [Number(pointsStrings[0]), Number(pointsStrings[1])];

        // console.log(points);

        if (data[i][1] !== "black") {
          // Locate point in grid
          const x = locate(points[0], "x"),
            y = locate(points[1], "y");

          const getColor = (value: [number, string]) => {
            return value[1] === data[i][1];
          };

          const thisColorIndex = gridData[x][y].findIndex(getColor);

          // If point of this color exists, increment count
          if (thisColorIndex > -1) {
            gridData[x][y][thisColorIndex][0]++;
          } else {
            // If point of this color does not exist, create it
            gridData[x][y].push([1, data[i][1]]);
          }
          // console.log(gridData[x][y]);
        }
      }
    }
    // console.log(gridData);
    setGrid(gridData);
  };

  // Renderers
  const renderData = (item: GridType, index: number) => {
    const x = index;
    return (
      // Columns
      item.map((item, index) => {
        const y = index;
        return (
          // Points
          item.map((item, index) => {
            return (
              <Circle
                key={`grid-${index}`}
                cx={x * gridIncrementX + gridIncrementX / 2}
                cy={y * gridIncrementY + gridIncrementY / 2}
                r={item[0] * strokeMultiplier}
                fill={item[1]}
                opacity={dataOpacity}
              />
            );
          })
        );
      })
    );
  };

  const renderRawData = (item: StrokeType, index: number) => {
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
  };

  const renderGridLines = (item: number[], index: number) => {
    return (
      <Path
        key={`grid-${index}`}
        d={`M${item[0]},0 ${item[0]},${height * size} M0,${item[1]} ${width},${
          item[1]
        }`}
        stroke={"black"}
        opacity={0.3}
        strokeWidth={2}
      />
    );
  };

  const pad = 12;

  return (
    <View>
      {/* Drawing */}
      <View style={{ height: height * size + pad }}>
        <ImageBackground
          source={silhouetteImage}
          imageStyle={{
            tintColor: "black",
            resizeMode: "contain",
            paddingBottom: pad,
          }}
        >
          <Svg>
            {/* previous strokes */}
            {showRawData && paths.map(renderRawData)}
            {/* grid lines */}
            {showGridLines && gridVisualized.map(renderGridLines)}
            {/* Compiled data */}
            {grid.map(renderData)}
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
