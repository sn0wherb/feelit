import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { uncapitalise } from "@/assets/functions";
import BodyDataCompilation from "./BodyDataCompilation";

interface Props {
  emotion: EmotionType;
  isAnalyticsLoading: boolean;
}

const ProfileSlide = ({ emotion, isAnalyticsLoading }: Props) => {
  const bodyHeight = 0.74;

  const handleSetLogData = (data: LogType[]) => {};

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
              {/* Time saturation */}
              <View style={styles.section}>
                <Text style={styles.title}>
                  When you feel most{" "}
                  {uncapitalise(analyticsData[selectedEmotion].emotion.name)}
                </Text>
              </View>
              {/* People */}
              <View style={styles.section}>
                <Text style={styles.title}>
                  {/* People you feel {uncapitalise(emotions[selectedEmotion].name)}{" "} */}
                  with
                </Text>
                <FlatList
                  data={commonPeople}
                  contentContainerStyle={{
                    gap: 10,
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        backgroundColor: item.color,
                        padding: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text>{item.name}</Text>
                    </View>
                  )}
                  keyExtractor={keyExtractor}
                />
              </View>
              {/* Places */}
              <View style={styles.section}>
                <Text style={styles.title}>
                  {/* Places you feel {uncapitalise(emotions[selectedEmotion].name)}{" "} */}
                  at
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileSlide;

const styles = StyleSheet.create({});
