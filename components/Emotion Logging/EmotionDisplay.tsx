import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
  View,
  Dimensions,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import RenderEmotion from "../RenderEmotion";

interface Props {
  currentEmotion: EmotionType;
  level: number;
  data: EmotionType[];
  isEditingEnabled: boolean;
  toggleEditing: (state: boolean) => void;
  refresh: () => void;
  passHandleClickEmotion: (item: EmotionType, svgData?: StrokeType[]) => void;
  onToggleHideEmotion: (name: string) => void;
}

const { width, height } = Dimensions.get("window");

const EmotionDisplay = ({
  data,
  isEditingEnabled,
  toggleEditing,
  currentEmotion,
  level,
  refresh,
  passHandleClickEmotion,
  onToggleHideEmotion,
}: Props) => {
  // ---------------------
  // CONSTS
  // ---------------------
  const router = useRouter();
  const db = useSQLiteContext();

  // Hide hidden emotions
  !isEditingEnabled && (data = data.filter((value) => !value.hidden));

  // Add a placeholder +1 item at the end, in the place of which a button to create a new emotion will be placed
  data = [
    ...data,
    {
      id: 0,
      color: "",
      level: 0,
      name: "placeholder",
      parent: null,
      isCustom: 0,
      hidden: true,
    },
  ];

  // ---------------------
  // FUNCTIONS
  // ---------------------
  const newCustomEmotion = () => {
    const params = currentEmotion
      ? { level: level, name: currentEmotion.name, color: currentEmotion.color }
      : { level: level };
    router.push({
      pathname: "/newCustomEmotion",
      params: params,
    });
  };

  const deleteEmotion = (id: number) => {
    Alert.alert(
      "Delete emotion?",
      "This emotion will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await db.runAsync(
                "DELETE FROM user_created_emotions WHERE id = ?",
                [id]
              );
              refresh();
            } catch (e) {
              console.error(e);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // ---------------------
  // COMPONENT
  // ---------------------
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 80 }}
      >
        {/* Hold to edit */}
        <Pressable
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            toggleEditing(true);
          }}
          style={{
            width: width,
            minHeight: height * 0.84,
            flex: 1,
            alignItems: "center",
          }}
        >
          <FlatList
            contentContainerStyle={{
              flex: 1,
              paddingTop: 10,
              paddingBottom: 10,
            }}
            scrollEnabled={false}
            numColumns={2}
            data={data}
            renderItem={({ index, item }) => {
              // If hit last, previously inserted placeholder item, return button to create new emotion
              if (index == data.length - 1) {
                if (isEditingEnabled || data.length == 1) {
                  return (
                    <View
                      style={{
                        width: 134,
                        height: 134,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 10,
                        marginHorizontal: 14,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          borderRadius: 100,
                          backgroundColor: "rgba(0,0,0,0.1)",
                          height: 90,
                          width: 90,
                          margin: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={newCustomEmotion}
                      >
                        <AntDesign name="plus" size={28} color={"black"} />
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  return <View />;
                }
              }
              // Else, return normal emotion
              return (
                // If editing is enabled, show delete button for custom emotions
                <View>
                  {isEditingEnabled && (
                    <View>
                      {item.isCustom == 1 ? (
                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            top: height * 0.02,
                            left: width * 0.04,
                            zIndex: 1,
                            elevation: 1,
                            backgroundColor: "#dcdcc5",
                            borderRadius: 50,
                            height: height * 0.05,
                            width: height * 0.05,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => {
                            deleteEmotion(item.id);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            top: height * 0.02,
                            left: width * 0.04,
                            zIndex: 1,
                            elevation: 1,
                            backgroundColor: "#dcdcc5",
                            borderRadius: 50,
                            height: height * 0.05,
                            width: height * 0.05,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => {
                            onToggleHideEmotion(item.name);
                          }}
                        >
                          {item.hidden ? (
                            <Feather name="eye" size={20} color="black" />
                          ) : (
                            <Feather name="eye-off" size={20} color="black" />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  <RenderEmotion
                    name={item["name"]}
                    color={item["color"]}
                    hidden={item.hidden}
                    onClick={() => {
                      if (!isEditingEnabled) {
                        passHandleClickEmotion(item);
                      }
                    }}
                  />
                </View>
              );
            }}
          />
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default EmotionDisplay;
