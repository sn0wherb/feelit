import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getLocalTime, uncapitalise } from "@/assets/functions";

type TimeFrameType = "Day" | "Week" | "Month" | "Year" | "All-time";

const { height, width } = Dimensions.get("window");

const MostFrequentEmotions = () => {
  const db = useSQLiteContext();
  const [selectedTimeFrameIndex, setSelectedTimeFrameIndex] =
    useState<TimeFrameType>("Month");
  const timeFrames: TimeFrameType[] = [
    "Day",
    "Week",
    "Month",
    "Year",
    "All-time",
  ];
  const [mostFrequentEmotions, setMostFrequentEmotions] = useState<
    {
      emotion: string;
      logCountByEmotion: number;
      color: string;
      created_at: string;
    }[]
  >([]);

  // Functions

  const getMostFrequentEmotions = async (timeFrame: TimeFrameType) => {
    let timeFrameSQL: string = "";
    const today = getLocalTime(new Date(), "date", "date") as Date;
    switch (timeFrame) {
      case "Day":
        timeFrameSQL = `created_at LIKE '${today.toISOString().slice(0, 10)}%'`;
        console.log(timeFrameSQL);
        break;
      case "Week":
        // Get number of current day
        const currentDayNumber = today.getDay();
        // Subtract current day's number from current day's date (js Date weekdays are 0-6, where 0 is Sunday, so we take 1 less day off to get Monday instead)
        const mondayOfThisWeek = new Date();
        mondayOfThisWeek.setDate(today.getDate() - (currentDayNumber - 1));
        // Create SQL query beginning
        const weekDay = new Date();
        timeFrameSQL = "created_at LIKE ";
        // Compose SQL query with each day in this week up to current day
        for (let i = 0; i < currentDayNumber; i++) {
          if (i != currentDayNumber - 1) {
            weekDay.setDate(mondayOfThisWeek.getDate() + i);
            timeFrameSQL += `'${weekDay
              .toISOString()
              .slice(0, 10)}%' OR created_at LIKE `;
          } else {
            weekDay.setDate(mondayOfThisWeek.getDate() + i);
            timeFrameSQL += `'${weekDay.toISOString().slice(0, 10)}%'`;
          }
        }
        break;
      case "Month":
        timeFrameSQL = `created_at LIKE '${today.toISOString().slice(0, 7)}%'`;
        break;
      case "Year":
        timeFrameSQL = `created_at LIKE '${today.toISOString().slice(0, 4)}%'`;
        break;
      default:
        // All-time
        timeFrameSQL = `created_at LIKE '%'`;
        break;
    }

    try {
      const data = await db.getAllAsync<{
        emotion: string;
        logCountByEmotion: number;
        color: string;
        created_at: string;
      }>(
        `SELECT 
        emotion,
        COUNT(emotion) AS logCountByEmotion,
        color,
        created_at
        FROM emotion_logs
        WHERE ${timeFrameSQL}
        GROUP BY emotion
        ORDER BY logCountByEmotion DESC
        LIMIT 6`
      );
      setMostFrequentEmotions(data);
    } catch (e) {
      console.error(e);
    }
  };

  // @ts-expect-error
  const renderTimeFrames = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.timeFrameSelectButton}
        onPress={() => {
          setSelectedTimeFrameIndex(item);
        }}
      >
        <Text
          style={[
            styles.timeFrameButtonText,
            {
              color: item == selectedTimeFrameIndex ? "#000" : "#777",
              textDecorationLine:
                item == selectedTimeFrameIndex ? "underline" : "none",
            },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  // @ts-expect-error
  const renderMostFrequentEmotions = ({ item, index }) => {
    // Create medals for top 3
    let fontSize,
      color,
      backgroundColor,
      borderColor,
      medalSize,
      borderWidth,
      outlineColor,
      outlineSize;
    switch (index) {
      case 0:
        color = "gold";
        backgroundColor = "#f5d94f";
        borderColor = "#e3b22f";
        fontSize = 38;
        medalSize = width * fontSize * 0.0038;
        outlineColor = "#8a7848";
        outlineSize = 2.2;
        borderWidth = 5;
        break;
      case 1:
        color = "silver";
        backgroundColor = "#d5d5d5";
        borderColor = "#8d8d8d";
        fontSize = 32;
        medalSize = width * fontSize * 0.003715;
        outlineColor = "#636363";
        outlineSize = 2;
        borderWidth = 3.4;
        break;
      case 2:
        color = "#CD7F32";
        backgroundColor = "#daa36e";
        borderColor = "#bd7c3e";
        fontSize = 28;
        medalSize = width * fontSize * 0.003714285714285714;
        outlineColor = "#79512a";
        outlineSize = 1.4;
        borderWidth = 3;
        break;
      default:
        color = "";
        fontSize = 20;
        borderWidth = 0;
        break;
    }
    const placementStyle = StyleSheet.create({
      placement: {
        fontSize,
        fontWeight: "bold",
        color: color,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth,
        borderRadius: 50,
        textAlign: "center",
        // Outline
        textShadowColor: "#000",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: outlineSize,
      },
    });

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: width * 0.04,
        }}
      >
        <TouchableOpacity onPress={() => {}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 12,
              paddingRight: 14,
              paddingVertical: 10,
              backgroundColor: item.color,
              marginVertical: 6,
              borderRadius: 10,
              // TO-DO: make exponential
              width: width * (0.56 + (3 - index) / 20),
            }}
          >
            <View
              style={{
                width: medalSize,
                justifyContent: "center",
                // Shadow
                shadowColor: outlineColor,
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
              }}
            >
              {index < 3 && (
                <Text style={placementStyle.placement}>{index + 1}</Text>
              )}
            </View>
            <Text style={{ fontSize: 24 }}>{item.emotion}</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            width: width * 0.08,
          }}
        >
          <Text
            style={{
              fontSize,
              fontWeight: "bold",
              color: item.color,
              textAlign: "center",
            }}
          >
            {item.logCountByEmotion}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getMostFrequentEmotions(selectedTimeFrameIndex);
  }, [selectedTimeFrameIndex]);

  return (
    <View>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 14,
        }}
      >
        My top emotions
        {/* My top emotions */}
      </Text>
      {/* Timeframes */}
      <View style={{ paddingBottom: 20 }}>
        <FlatList
          contentContainerStyle={{ gap: 10 }}
          scrollEnabled={false}
          horizontal={true}
          data={timeFrames}
          renderItem={renderTimeFrames}
        />
      </View>
      {/* Emotions in selected timeframe */}
      <View>
        {mostFrequentEmotions.length > 0 ? (
          // Emotions in this timeframe exist
          <FlatList
            scrollEnabled={false}
            data={mostFrequentEmotions}
            renderItem={renderMostFrequentEmotions}
          />
        ) : (
          // No emotions in this timeframe
          <View>
            <Text style={styles.noEmotionsInThisTimeframe}>
              You haven't added any emotions{" "}
              {selectedTimeFrameIndex == "Day"
                ? "today."
                : "this " + uncapitalise(selectedTimeFrameIndex) + "."}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MostFrequentEmotions;

const styles = StyleSheet.create({
  timeFrameSelectButton: {},
  timeFrameButtonText: {
    // textDecorationLine: "underline",
    fontSize: 20,
  },
  noEmotionsInThisTimeframe: {
    color: "#444",
    fontSize: 20,
  },
});
