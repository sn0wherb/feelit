import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import React, { useCallback, useState } from "react";
import { Svg, Path } from "react-native-svg";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
interface Props {
  logId: number;
  emotion?: string;
  size?: number;
}

const { height } = Dimensions.get("window");

const BodyDisplay = ({ logId, emotion, size = 0.76 }: Props) => {
  // ---------------------
  // CONSTS
  // ---------------------
  const silhouetteImage = require("@/assets/images/silhouette_front.png");

  const db = useSQLiteContext();

  // ---------------------
  // EFFECTS
  // ---------------------
  const [paths, setPaths] = useState<StrokeType[]>([[["M0,0"], "black", 1]]);

  // ---------------------
  // FUNCTIONS
  // ---------------------
  const getData = async () => {
    try {
      const data = await db.getAllAsync<SvgDataType>(
        "SELECT * FROM bodydrawing_svg_paths WHERE id = ?",
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

  // ---------------------
  // EFFECTS
  // ---------------------
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  // ---------------------
  // COMPONENT
  // ---------------------
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
