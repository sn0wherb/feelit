import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { getLocalTime, keyExtractor, uncapitalise } from "@/assets/functions";
import BodyDataCompilation from "./BodyDataCompilation";
import { memo, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

interface Props {
  emotion: EmotionType;
}

const { width, height } = Dimensions.get("window");

const ProfileSlide = ({ emotion }: Props) => {
  const bodyHeight = 0.74;
  const db = useSQLiteContext();

  //
  // STATES
  //
  const [logData, setLogData] = useState<LogType[]>([]);
  const [commonPeople, setCommonPeople] = useState<SelectionType[]>([]);
  const [commonPlaces, setCommonPlaces] = useState<SelectionType[]>([]);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [commonWeekdaysMax, setCommonWeekdaysMax] = useState(0);
  const [commonTimesMax, setCommonTimesMax] = useState(0);
  const [commonTimes, setCommonTimes] = useState<
    { item: number; count: number }[]
  >([]);
  const [commonWeekdays, setCommonWeekdays] = useState<
    { item: string; count: number }[]
  >([]);

  //
  // FUNCTIONS
  //
  const handleSetLogData = (data: LogType[]) => {
    setLogData(data);
    // if there's no logs, there's no people or places to get
    if (data.length > 0) {
      getCommonWeekdaysAndTimes(data);
      getCommonPeople(data);
      getCommonPlaces(data);
    }
    setIsAnalyticsLoading(false);
  };

  const getCommonWeekdaysAndTimes = async (data: LogType[]) => {
    const commonWeekdays = [];
    const commonTimes = [];

    for (const log of data) {
      const localTimeZoneDate = getLocalTime(log.created_at, "date", "date");
      commonWeekdays.push(localTimeZoneDate);
      const localTimeZoneTime = getLocalTime(log.created_at, "time") as string;
      commonTimes.push(Number(localTimeZoneTime.slice(0, 2)));
    }

    getCommonTimes(commonTimes);
    getCommonWeekdays(commonWeekdays as Date[]);
  };

  const getCommonTimes = async (commonTimes: number[]) => {
    // Create an array to store time counts
    const timeCounts: { item: number; count: number }[] = [];

    for (const time of commonTimes) {
      // Find if this time already exists in our counts array
      const existingTime = timeCounts.find((t) => t.item === time);

      if (existingTime) {
        // If time exists, increment its count
        existingTime.count++;
      } else {
        // If time doesn't exist, add it with count 1
        timeCounts.push({ item: time, count: 1 });
      }
    }

    // Get max count for times
    const maxCount = timeCounts.reduce(
      (max, current) => Math.max(max, current.count),
      0
    );

    // Get top 10 times in descending order
    timeCounts.sort((a, b) => b.count - a.count);
    const top10Times = timeCounts.slice(0, 10);

    // Sort by time in ascending order
    top10Times.sort((a, b) => Number(a.item) - Number(b.item));

    setCommonTimes(top10Times);
    setCommonTimesMax(maxCount);
    return timeCounts;
  };

  const getCommonWeekdays = async (commonWeekdays: Date[]) => {
    const weekdayCounts: { item: string; count: number }[] = [
      { item: "Mon", count: 0 },
      { item: "Tue", count: 0 },
      { item: "Wed", count: 0 },
      { item: "Thu", count: 0 },
      { item: "Fri", count: 0 },
      { item: "Sat", count: 0 },
      { item: "Sun", count: 0 },
    ];

    for (const day of commonWeekdays) {
      const weekday = new Date(day).toLocaleDateString("default", {
        weekday: "short",
      });

      // Find if this weekday already exists in our counts array
      const existingWeekday = weekdayCounts.find((w) => w.item === weekday);

      if (existingWeekday) {
        // If weekday exists, increment its count
        existingWeekday.count++;
      } else {
        // If weekday doesn't exist, add it with count 1
        weekdayCounts.push({ item: weekday, count: 1 });
      }
    }

    // Get max count for times
    const maxCount = weekdayCounts.reduce(
      (max, current) => Math.max(max, current.count),
      0
    );

    setCommonWeekdays(weekdayCounts);
    setCommonWeekdaysMax(maxCount);
    return weekdayCounts;
  };

  const getCommonPeople = async (data: LogType[]) => {
    try {
      // Create an array to store person counts
      const personCounts: { person: number; count: number }[] = [];

      // For each log in logData
      for (const log of data) {
        // Get associated people from emotion_log_people table
        const associatedPeople = await db.getAllAsync<{ person_id: number }>(
          `SELECT person_id FROM emotion_log_people WHERE log_id = ${log.id}`
        );

        // console.log(associatedPeople);

        // For each associated person
        for (const { person_id } of associatedPeople) {
          // Find if this person already exists in our counts array
          const existingPerson = personCounts.find(
            (p) => p.person === person_id
          );

          if (existingPerson) {
            // If person exists, increment their count
            existingPerson.count++;
          } else {
            // If person doesn't exist, add them with count 1
            personCounts.push({ person: person_id, count: 1 });
          }
        }
      }

      // Sort by count in descending order
      personCounts.sort((a, b) => b.count - a.count);

      // Get the actual person data for the top results
      const topPeople = (
        await Promise.all(
          personCounts.slice(0, 3).map(async ({ person }) => {
            const personData = await db.getFirstAsync<SelectionType>(
              `SELECT * FROM people WHERE id = ${person}`
            );
            return personData;
          })
        )
      ).filter((person): person is SelectionType => person !== null);

      // return topPeople;
      setCommonPeople(topPeople);
    } catch (e) {
      console.error("Error getting common people:", e);
    }
  };

  const getCommonPlaces = async (data: LogType[]) => {
    try {
      // Create an array to store place counts
      const placeCounts: { place: number; count: number }[] = [];

      // For each log in logData
      for (const log of data) {
        // Get associated people from emotion_log_people table
        const associatedPlaces = await db.getAllAsync<{ place_id: number }>(
          `SELECT place_id FROM emotion_log_places WHERE log_id = ${log.id}`
        );

        // console.log(associatedPeople);

        // For each associated place
        for (const { place_id } of associatedPlaces) {
          // Find if this place already exists in our counts array
          const existingPlace = placeCounts.find((p) => p.place === place_id);

          if (existingPlace) {
            // If place exists, increment their count
            existingPlace.count++;
          } else {
            // If place doesn't exist, add them with count 1
            placeCounts.push({ place: place_id, count: 1 });
          }
        }
      }

      // Sort by count in descending order
      placeCounts.sort((a, b) => b.count - a.count);

      // Get the actual place data for the top results
      const topPlaces = (
        await Promise.all(
          placeCounts.slice(0, 3).map(async ({ place }) => {
            const placeData = await db.getFirstAsync<SelectionType>(
              `SELECT * FROM places WHERE id = ${place}`
            );
            return placeData;
          })
        )
      ).filter((place): place is SelectionType => place !== null);

      setCommonPlaces(topPlaces);
    } catch (e) {
      console.error("Error getting common places:", e);
    }
  };

  // Shared function for rendering top weekdays and top times
  const maxHeight = height * 0.08;
  const renderChart = ({
    item,
  }: {
    item: { item: number | string; count: number };
  }) => {
    // Get the appropriate max value
    const max =
      typeof item.item == typeof "" ? commonWeekdaysMax : commonTimesMax;
    // Highest value is always the value of maxHeight, all the others are calculated and displayed relative to this value
    const barHeight = max > 0 ? (item.count / max) * maxHeight : 0;
    const color = item.count == 0 ? "#666" : "#000";

    return (
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            height: barHeight,
            width: width * 0.04,
            backgroundColor: emotion.color,
            marginBottom: 6,
            borderRadius: 4,
          }}
        />
        {/* Upon converting hour strings to numbers the 0 in front of AM times gets removed, here i'm adding it back */}
        {typeof item.item === typeof 5 && String(item.item).length == 1 ? (
          <Text>0{item.item}</Text>
        ) : (
          <Text style={{ color }}>{item.item}</Text>
        )}
      </View>
    );
  };

  const renderSelectable = ({ item }: { item: SelectionType }) => (
    <View
      style={{
        backgroundColor: item.color,
        padding: 10,
        borderRadius: 20,
      }}
    >
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View>
      <ScrollView pagingEnabled>
        {/* Body */}
        <BodyDataCompilation
          size={bodyHeight}
          emotion={emotion}
          setLogData={handleSetLogData}
        />

        {/* Analytics */}
        <View>
          {/* This would take a lot of word processing */}
          {/* <View style={styles.section}>
            <Text style={styles.title}>Most common cause</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Most common need</Text>
          </View> */}
          {isAnalyticsLoading ? (
            <ActivityIndicator />
          ) : (
            <View>
              {logData.length > 0 ? (
                <View>
                  {/* Time saturation */}
                  <View style={styles.section}>
                    <Text style={styles.title}>
                      When you feel {uncapitalise(emotion.name)}
                    </Text>
                    {/* Times */}
                    <FlatList
                      contentContainerStyle={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        gap: 10,
                      }}
                      data={commonTimes}
                      renderItem={renderChart}
                    />
                    {/* Weekdays */}
                    <View style={{ padding: 12 }}>
                      <FlatList
                        contentContainerStyle={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          gap: 14,
                        }}
                        data={commonWeekdays}
                        renderItem={renderChart}
                      />
                    </View>
                  </View>
                  {/* People */}
                  <View style={styles.section}>
                    <Text style={styles.title}>
                      People you feel {uncapitalise(emotion.name)} with
                    </Text>
                    {commonPeople.length > 0 ? (
                      <FlatList
                        data={commonPeople}
                        contentContainerStyle={{
                          gap: 10,
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                        scrollEnabled={false}
                        renderItem={renderSelectable}
                        keyExtractor={keyExtractor}
                      />
                    ) : (
                      <Text style={styles.noDataText}>No people added</Text>
                    )}
                  </View>
                  {/* Places */}
                  <View style={styles.section}>
                    <Text style={styles.title}>
                      Places you feel {uncapitalise(emotion.name)} at
                    </Text>
                    {commonPlaces.length > 0 ? (
                      <FlatList
                        data={commonPlaces}
                        contentContainerStyle={{
                          gap: 10,
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                        scrollEnabled={false}
                        renderItem={renderSelectable}
                        keyExtractor={keyExtractor}
                      />
                    ) : (
                      <Text style={styles.noDataText}>No places added</Text>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.section}>
                  <Text style={styles.noLogsText}>
                    No logs under {uncapitalise(emotion.name)}.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(ProfileSlide);

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    paddingBottom: 20,
  },
  noDataText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  noLogsText: {
    color: "#222",
    fontSize: 18,
    textAlign: "center",
  },
});
