import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getLocalTime, keyExtractor, uncapitalise } from "@/assets/functions";
import BodyDataCompilation from "./BodyDataCompilation";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

interface Props {
  emotion: EmotionType;
}

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
  const [commonDates, setCommonDates] = useState<string[]>([]);
  const [commonTimes, setCommonTimes] = useState<string[]>([]);

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
      const localTimeZoneDate = getLocalTime(log.created_at, "date");
      commonDates.push(localTimeZoneDate);
      const localTimeZoneTime = getLocalTime(log.created_at, "time");
      commonTimes.push(localTimeZoneTime);
    }

    setCommonDates(commonDates);
    setCommonTimes(commonTimes);

    // try {
    //   // Create an array to store time counts
    //   const timeCounts: { time: string; count: number }[] = [];

    //   // For each log in logData
    //   for (const log of data) {
    //     // Get the created_at time (formatted as HH:MM)
    //     const time = new Date(log.created_at).toLocaleTimeString([], {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //     });

    //     // Find if this time already exists in our counts array
    //     const existingTime = timeCounts.find((t) => t.time === time);

    //     if (existingTime) {
    //       // If time exists, increment its count
    //       existingTime.count++;
    //     } else {
    //       // If time doesn't exist, add it with count 1
    //       timeCounts.push({ time, count: 1 });
    //     }
    //   }

    //   // Sort by count in descending order
    //   timeCounts.sort((a, b) => b.count - a.count);

    //   // Log the top 5 times
    //   console.log("Top 5 common times:", timeCounts.slice(0, 5));
    // } catch (e) {
    //   console.error("Error getting common times:", e);
    // }
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
      <ScrollView style={{}}>
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
                      When you feel most {uncapitalise(emotion.name)}:
                    </Text>
                    <View>
                      <Text>Time</Text>
                      <FlatList
                        data={commonTimes}
                        renderItem={({ item }) => {
                          return <Text>{item}</Text>;
                        }}
                      />
                    </View>
                    <View>
                      <Text>Day</Text>
                    </View>
                  </View>
                  {/* People */}
                  <View style={styles.section}>
                    <Text style={styles.title}>
                      People you usually feel {uncapitalise(emotion.name)} with:
                    </Text>
                    {commonPeople.length > 0 ? (
                      <FlatList
                        data={commonPeople}
                        contentContainerStyle={{
                          gap: 10,
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                        scrollEnabled={false}
                        renderItem={renderSelectable}
                        keyExtractor={keyExtractor}
                      />
                    ) : (
                      <Text style={{ color: "#666", fontSize: 16 }}>
                        No people added
                      </Text>
                    )}
                  </View>
                  {/* Places */}
                  <View style={styles.section}>
                    <Text style={styles.title}>
                      Places you usually feel {uncapitalise(emotion.name)} at:
                    </Text>
                    {commonPlaces.length > 0 ? (
                      <FlatList
                        data={commonPlaces}
                        contentContainerStyle={{
                          gap: 10,
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                        scrollEnabled={false}
                        renderItem={renderSelectable}
                        keyExtractor={keyExtractor}
                      />
                    ) : (
                      <Text style={{ color: "#666", fontSize: 16 }}>
                        No places added
                      </Text>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.section}>
                  <Text style={styles.title}>
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
    padding: 12,
  },
  title: {
    fontSize: 18,
    paddingVertical: 12,
  },
});
