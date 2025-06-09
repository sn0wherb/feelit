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
import { useState } from "react";
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
  const [commonDates, setCommonDates] = useState<
    { weekday: string; count: number }[]
  >([]);
  const [commonTimes, setCommonTimes] = useState<
    { time: string; count: number }[]
  >([]);

  //
  // FUNCTIONS
  //
  const handleSetLogData = (data: LogType[]) => {
    setLogData(data);
    // if there's no logs, there's no people or places to get
    if (data.length > 0) {
      getCommonDatesAndTimes(data);
      getCommonPeople(data);
      getCommonPlaces(data);
    }
    setIsAnalyticsLoading(false);
  };

  const getCommonDatesAndTimes = async (data: LogType[]) => {
    const commonDates = [];
    const commonTimes = [];

    for (const log of data) {
      // console.log(log.created_at);
      const localTimeZoneDate = getLocalTime(log.created_at, "date", "date");
      commonDates.push(localTimeZoneDate);
      const localTimeZoneTime = getLocalTime(log.created_at, "time");
      // @ts-expect-error
      commonTimes.push(localTimeZoneTime.slice(0, 2));
    }

    // Create an array to store time counts
    const timeCounts: { time: string; count: number }[] = [];

    for (const time of commonTimes) {
      // Find if this time already exists in our counts array
      const existingTime = timeCounts.find((t) => t.time === time);

      if (existingTime) {
        // If time exists, increment its count
        existingTime.count++;
      } else {
        // If time doesn't exist, add it with count 1
        timeCounts.push({ time, count: 1 });
      }
    }

    // Sort by time in ascending order
    timeCounts.sort((a, b) => Number(a.time) - Number(b.time));

    setCommonTimes(timeCounts);

    const weekdayCounts: { weekday: string; count: number }[] = [
      { weekday: "Mon", count: 0 },
      { weekday: "Tue", count: 0 },
      { weekday: "Wed", count: 0 },
      { weekday: "Thur", count: 0 },
      { weekday: "Fri", count: 0 },
      { weekday: "Sat", count: 0 },
      { weekday: "Sun", count: 0 },
    ];

    for (const date of commonDates) {
      const weekday = new Date(date).toLocaleDateString("default", {
        weekday: "short",
      });

      // Find if this time already exists in our counts array
      const existingWeekday = weekdayCounts.find((w) => w.weekday === weekday);

      if (existingWeekday) {
        // If time exists, increment its count
        existingWeekday.count++;
      } else {
        // If time doesn't exist, add it with count 1
        weekdayCounts.push({ weekday, count: 1 });
      }
    }

    setCommonDates(weekdayCounts);
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
          personCounts.slice(0, 5).map(async ({ person }) => {
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
          placeCounts.slice(0, 5).map(async ({ place }) => {
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
      <ScrollView>
        {/* Body */}
        <BodyDataCompilation
          size={bodyHeight}
          emotion={emotion}
          setLogData={handleSetLogData}
        />

        {/* Analytics */}
        <View style={{ gap: 12, paddingBottom: 50 }}>
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
                    {/* Time */}
                    <View style={{ padding: 12 }}>
                      <FlatList
                        contentContainerStyle={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          gap: 10,
                        }}
                        data={commonTimes}
                        renderItem={({ item }) => {
                          return (
                            <View style={{ alignItems: "center" }}>
                              <View
                                style={{
                                  height: item.count * height * 0.02,
                                  width: width * 0.04,
                                  backgroundColor: emotion.color,
                                  marginBottom: 6,
                                  borderRadius: 4,
                                }}
                              />
                              <Text>{item.time}</Text>
                            </View>
                          );
                        }}
                      />
                    </View>
                    {/* Date */}
                    <View style={{ padding: 12 }}>
                      <FlatList
                        contentContainerStyle={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          gap: 14,
                        }}
                        data={commonDates}
                        renderItem={({ item }) => {
                          return (
                            <View style={{ alignItems: "center" }}>
                              <View
                                style={{
                                  height: item.count * height * 0.02,
                                  width: width * 0.04,
                                  backgroundColor: emotion.color,
                                  marginBottom: 6,
                                  borderRadius: 4,
                                }}
                              />
                              <Text>{item.weekday}</Text>
                            </View>
                          );
                        }}
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

export default ProfileSlide;

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginVertical: 10,
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
