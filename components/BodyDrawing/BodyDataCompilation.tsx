import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import React, { memo, useCallback, useState } from "react";
import { Svg, Path, Circle } from "react-native-svg";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";

type GridType = [[number, string]][];

interface Props {
  logId?: number;
  emotion?: EmotionType;
  size?: number;
  displayMargin?: number;
  setLogData: (data: LogType[], emotion?: EmotionType) => void;
}

const { height, width } = Dimensions.get("window");

const BodyDataCompilation = ({
  emotion = {
    id: -1,
    color: "#fff",
    level: 1,
    parent: null,
    name: "undefined",
    isCustom: 0,
    hidden: false,
  },
  size = 0.76,
  displayMargin = 1,
  setLogData,
}: Props) => {
  // ---------------------
  // CONSTS
  // ---------------------
  const silhouetteImage = require("@/assets/images/silhouette_front.png");
  const { stockEmotionData } = require("@/assets/stockEmotionData");

  const db = useSQLiteContext();

  const pad = 0;

  // ---------------------
  // STATES
  // ---------------------
  const [gridVisualized, setGridVisualized] = useState<number[][]>([]);
  const [grid, setGrid] = useState<GridType[]>([]);
  const [maxPointValue, setMaxPointValue] = useState(0);

  // ---------------------
  // FUNCTIONS
  // ---------------------
  const getAllData = async () => {
    const children = await getChildrenEmotions(emotion);
    let logQuery = `emotion = '${emotion.name}' `;
    if (children) {
      children?.forEach((value) => {
        logQuery += `OR emotion = '${value}'`;
      });
    } else {
      logQuery = `emotion = '${emotion.name}'`;
    }

    // Get all logs under this base emotion and its child emotions
    try {
      const data = await db.getAllAsync<LogType>(
        `SELECT * FROM emotion_logs WHERE ${logQuery}`
      );

      if (data.length < 1) {
        setLogData([]);
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
        populateGrid(strokeData);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error("Error getting data", e);
    }
  };

  const getCustomChildrenEmotions = async (parent: EmotionType) => {
    try {
      const data = await db.getAllAsync<EmotionType>(
        `SELECT * FROM user_created_emotions WHERE parent = '${parent.name}'`
      );
      // Base case
      if (!data || data.length < 1) {
        return [];
      }

      // Recursively get children for each emotion found
      const allChildren: EmotionType[] = [...data];
      for (const emotion of data) {
        const children = await getCustomChildrenEmotions(emotion);
        allChildren.push(...children);
      }
      return allChildren;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getChildrenEmotions = async (parent: EmotionType) => {
    if (parent.isCustom) {
      return getCustomChildrenEmotions(parent);
    }

    let children: string[] = [];
    // Stock emotions
    const secondLvl: EmotionType[] = [...stockEmotionData[2][parent.name]];
    secondLvl.forEach((secondLvlEmotion) => {
      children.push(secondLvlEmotion.name);
      const thirdLvl: EmotionType[] = [
        ...stockEmotionData[3][secondLvlEmotion.name],
      ];
      thirdLvl.forEach((thirdLvlEmotion) => {
        children.push(thirdLvlEmotion.name);
      });
    });

    // Custom emotions
    const customEmotions = await getCustomChildrenEmotions(parent);
    customEmotions.forEach((emotion) => {
      children.push(emotion.name);
    });

    return children;
  };

  // ---------------------
  // SET GRID SECTION COUNT AND DATA OPACITY HERE
  // ---------------------
  const gridSections = 30;
  const dataOpacity = 0.4;

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
    //  ],
    //  ...
    // ]
    let grid: GridType[] = [];

    // Rows
    for (let i = 0; i < rows; i++) {
      grid.push([]);
      // Columns
      for (let j = 0; j < columns; j++) {
        // I believe this use of ts-expect-error is justified
        // @ts-expect-error
        grid[i].push([]);
      }
    }
    return grid;
  };

  const populateGrid = (data: StrokeType[]) => {
    const gridData = createGrid(gridSections);

    // Gridlines
    let gridTemp = gridVisualized;
    for (let i = 0; i < gridSections; i++) {
      gridTemp.push([gridIncrementX * i, gridIncrementY * i]);
    }
    setGridVisualized(gridTemp);

    const regExAll = /\d{1,}/g; // Regex that matches the digits in svg stroke strings

    // Locate stroke in gridData using binary search
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

    let maxValue = 0;

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

          const currentLocation = gridData[x][y];

          const thisColorIndex = currentLocation.findIndex(getColor);

          let addedPointValue;
          // If point of this color exists, increment count
          if (thisColorIndex > -1) {
            currentLocation[thisColorIndex][0]++;
            addedPointValue = currentLocation[thisColorIndex][0];
          } else {
            // If point of this color does not exist, create it
            currentLocation.push([1, data[i][1]]);
            addedPointValue = currentLocation[currentLocation.length - 1][0];
          }

          // If, after inserting into this location, it has the highest value of all locations, set maxValue to this value
          if (addedPointValue > maxValue) {
            maxValue = addedPointValue;
          }
        }
      }
    }

    setMaxPointValue(maxValue);
    setGrid(gridData);
  };

  // Renderers
  const maxRadius = 30;
  const renderData = (item: GridType, index: number) => {
    const x = index;
    return (
      // Columns
      item.map((item, index) => {
        const y = index;
        return (
          // Points
          item.map((item, index) => {
            const radius =
              maxPointValue > 0 ? (item[0] / maxPointValue) * maxRadius : 0;

            return (
              <Circle
                key={`grid-${index}`}
                // I seriously have no idea why this needs to be divided by 10 but it works lmfao
                cx={
                  (x - displayMargin / 10) * gridIncrementX + gridIncrementX / 2
                }
                cy={y * gridIncrementY + gridIncrementY / 2}
                r={radius}
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

  // ---------------------
  // EFFECTS
  // ---------------------
  useFocusEffect(
    useCallback(() => {
      getAllData();
    }, [])
  );

  // ---------------------
  // COMPONENT
  // ---------------------
  return (
    <View>
      {/* Drawing */}
      <View style={{ height: height * size + pad }}>
        <ImageBackground
          source={silhouetteImage}
          imageStyle={{
            tintColor: "black",
            resizeMode: "contain",
            paddingTop: pad,
          }}
        >
          <View style={{ marginTop: pad }}>
            <Svg>
              {/* Compiled data */}
              {grid.map(renderData)}
            </Svg>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default memo(BodyDataCompilation);

const styles = StyleSheet.create({
  drawingBoard: {
    height: height * 0.76,
  },
});
