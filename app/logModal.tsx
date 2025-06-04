import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import BodyDrawing from "@/components/BodyDrawing";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import BodyDisplay from "@/components/BodyDisplay";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import BodyDataCompilation from "@/components/BodyDataCompilation";

const { width, height } = Dimensions.get("window");

export default function logModal() {
  const logData = useLocalSearchParams();
  const db = useSQLiteContext();
  const router = useRouter();

  const [isOptionsDropdownVisible, setIsOptionsDropdownVisible] =
    useState(false);

  const [logPeople, setLogPeople] = useState<PersonType[]>([]);

  // Functions
  const deleteLog = () => {
    Alert.alert("Delete log?", "This log will be permanently deleted.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => confirmDeleteLog(),
        style: "destructive",
      },
    ]);
  };

  const confirmDeleteLog = async () => {
    try {
      await db.runAsync("DELETE FROM emotion_logs WHERE id = ?", [
        Number(logData.id),
      ]);
      router.back();
    } catch (e) {
      console.error(e);
    }
  };

  const getLogPeople = async () => {
    const people = await db.getAllAsync<PersonType>("SELECT * FROM people WHERE id IN (SELECT person_id FROM emotion_log_people WHERE log_id = ?)", [
      Number(logData.id),
    ]);
    setLogPeople(people);
  }

  const renderPerson = ({ item }: { item: PersonType }) => {
    return (
      <View style={{backgroundColor: item.color, padding: 10, borderRadius: 20}}>
        <Text>{item.name}</Text>
      </View>
    );
  }

  useEffect(() => {
    getLogPeople();
  }, []);

  return (
    <View style={{ backgroundColor: "beige", height: height, width: width }}>
      <View style={{ flex: 1 }}>
        {/* Title & Exit button */}
        <View
          style={{
            paddingTop: 30,
            paddingHorizontal: 14,
            borderBottomWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            backgroundColor: String(logData.color),
            height: height * 0.12,
          }}
        >
          <View
            style={{
              position: "sticky",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {/* Exit log */}
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              {logData.emotion}
            </Text>
            {/* Options */}
            {isOptionsDropdownVisible ? (
              <TouchableOpacity
                onPress={() => {
                  setIsOptionsDropdownVisible(false);
                }}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setIsOptionsDropdownVisible(true);
                }}
              >
                <Entypo name="dots-three-vertical" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Options dropdown */}
        {isOptionsDropdownVisible && (
          <View
            style={[
              styles.optionsDropdown,
              { backgroundColor: String(logData.color) },
            ]}
          >
            <TouchableOpacity onPress={() => {}} style={styles.optionItem}>
              <Feather name="edit-2" size={24} color="black" />
              <Text style={{ fontSize: 18 }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteLog} style={styles.optionItem}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={26}
                color="black"
              />
              <Text style={{ fontSize: 18 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Log Data */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            {/* Journal */}
            <View
              style={{
                alignItems: "center",
                paddingHorizontal: 20,
                flex: 1,
                width: width,
              }}
            >
              {/* Cause */}
              {logData.root.length > 0 && (
                <View style={styles.emotionDetail}>
                  <View style={[styles.emotionDetailTitleBackground, {backgroundColor: String(logData.color)}]}>
                  <Text
                    style={[
                      styles.emotionDetailTitle,
                      {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      },
                    ]}
                  >
                    Why?
                  </Text>
                  </View>
                  <Text style={styles.detailContent}>{logData.root}</Text>
                </View>
              )}
              {/* Need */}
              {logData.need.length > 0 && (
                <View style={styles.emotionDetail}>
                  <View style={[styles.emotionDetailTitleBackground, {backgroundColor: String(logData.color)}]}>
                  <Text
                    style={[
                      styles.emotionDetailTitle,
                      {
                        backgroundColor: "rgba(0, 0, 0, 0.15)",
                      },
                    ]}
                  >
                    What did I need?
                  </Text>
                  </View>
                  <Text style={styles.detailContent}>{logData.need}</Text>
                </View>
              )}
              {/* People */}
              {logPeople.length > 0 && (
                <View style={styles.emotionDetail}>
                  <View style={[styles.emotionDetailTitleBackground, {backgroundColor: String(logData.color)}]}>
                  <Text
                    style={[
                      styles.emotionDetailTitle,
                      {
                        backgroundColor: "rgba(0, 0, 0, 0.20)",
                      },
                    ]}
                  >
                    Who was I with?
                  </Text>
                  </View>
                  <FlatList
                    scrollEnabled={false}
                    data={logPeople}
                    renderItem={renderPerson}
                    contentContainerStyle={{
                      marginVertical: 6,
                      gap: 10,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
              </View>
              )}
              {/* Diary */}
              {logData.extra.length > 0 && (
                <View style={styles.emotionDetail}>
                  <View style={[styles.emotionDetailTitleBackground, {backgroundColor: String(logData.color)}]}>
                  <Text
                    style={[
                      styles.emotionDetailTitle,
                      {
                        backgroundColor: "rgba(0, 0, 0, 0.25)",
                      },
                    ]}
                  >
                    Diary
                  </Text>
                  </View>
                  <Text style={styles.detailContent}>{logData.extra}</Text>
                </View>
              )}
            </View>
            {/* BodyDrawing */}
            <View>
              <BodyDisplay logId={Number(logData.id)} />
            </View>
            {/* Date of creation */}
              <View
                style={{
                  height: height * 0.08,
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.1)",
                }}
              >
                <Text style={styles.date}>
                  {logData.date} • {logData.time}
                </Text>
              </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// export default logModal;

const styles = StyleSheet.create({
  emotionDetailTitleBackground: {
    borderRadius: 30,
    height: height * 0.04,
    marginVertical: 8,
  },
  emotionDetail: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emotionDetailTitle: {
    textAlign: "center",
    fontSize: 17,
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 4,
  },
  detailContent: {
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  date: {
    textAlign: "center",
    fontSize: 18,
  },
  optionsDropdown: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    top: height * 0.12,
    right: 0,
    gap: 20,
    marginRight: 6,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 12,
    paddingRight: 20,
    width: width * 0.36,
    // borderColor: "rgba(0,0,0,0.3)",
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
