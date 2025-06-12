import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  title: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  currentEmotion: EmotionType;
  type?: "place" | "person" | "text";
  selectedData?: SelectionType[];
  onUpdateSelectedData?: (data: SelectionType[]) => void;
  initialFieldState?: boolean;
}

const { width, height } = Dimensions.get("window");

const JournalField = ({
  title,
  value,
  currentEmotion,
  type = "text",
  selectedData = [],
  onUpdateSelectedData,
  onChangeText,
  initialFieldState = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(initialFieldState);
  const [isSelectableModalOpen, setIsSelectableModalOpen] = useState(false);
  const db = useSQLiteContext();
  const [data, setData] = useState<SelectionType[]>([]);

  // Functions
  const getData = async () => {
    const data = await db.getAllAsync<SelectionType>(
      `SELECT * FROM ${type === "person" ? "people" : "places"}`
    );
    setData([
      ...data,
      { id: 0, name: `Add new ${type}`, color: "white", selected: false },
    ]);
  };

  const createNewSelectable = () => {
    router.push({
      pathname: "/createNewSelectable",
      params: { type: type === "person" ? "people" : "places" },
    });
  };

  const renderSelectable = ({
    item,
    index,
  }: {
    item: SelectionType;
    index: number;
  }) => {
    // Add new person
    if (index === data.length - 1) {
      return (
        <View style={{ paddingVertical: 4 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              padding: 10,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
            onPress={() => {
              createNewSelectable();
            }}
          >
            <AntDesign name="plus" size={18} color={"black"} />
            <Text style={{ fontSize: 16 }}>Add {type}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Existing person
    return (
      <View style={{ paddingVertical: 4 }}>
        {selectedData.some((selectable) => selectable.id === item.id) && (
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              elevation: 1,
              top: 0,
              right: 0,
              backgroundColor: "rgba(227, 215, 183, 0.8)",
              padding: 4,
              borderRadius: 100,
              height: 24,
              width: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6 name="check" size={16} color="black" />
          </View>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: item.color,
            paddingVertical: 7,
            paddingHorizontal: 12,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: item.selected
              ? "rgba(227, 215, 183, 0.8)"
              : "transparent",
          }}
          onPress={() => {
            if (selectedData.some((selectable) => selectable.id === item.id)) {
              onUpdateSelectedData?.(
                selectedData.filter((selectable) => selectable.id !== item.id)
              );
            } else {
              onUpdateSelectedData?.([...selectedData, item]);
            }
          }}
        >
          <Text style={{ fontSize: 16 }}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSelectedSelectable = ({ item }: { item: SelectionType }) => {
    return (
      <View
        style={{
          backgroundColor: item.color,
          paddingVertical: 7,
          paddingHorizontal: 12,
          borderRadius: 20,
        }}
      >
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </View>
    );
  };

  // Closing a journal field
  const handleTerminateField = () => {
    setIsOpen(false);
    onChangeText?.("");
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  if (isSelectableModalOpen) {
    return (
      <View
        style={{
          width: width,
          height: height,
          position: "absolute",
          zIndex: 1,
          elevation: 1,
          top: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setIsSelectableModalOpen(false)}
          style={{
            position: "absolute",
            zIndex: 2,
            elevation: 2,
            top: 6,
            right: 28,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgb(197, 182, 145)",
            padding: 4,
            borderRadius: 100,
            height: 40,
            width: 40,
          }}
        >
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>
        <View
          style={{
            width: width * 0.8,
            position: "absolute",
            zIndex: 1,
            elevation: 1,
            top: height * 0.02,
            backgroundColor: "rgba(227, 215, 183, 1)",
            height: height * 0.64,
            alignSelf: "center",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <FlatList
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
            scrollEnabled={false}
            data={data}
            renderItem={renderSelectable}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        width: width,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 20,
      }}
    >
      <View>
        <Text style={{ fontSize: 19 }}>{title}</Text>
      </View>
      {type === "text" ? (
        <View>
          {!isOpen ? (
            <TouchableOpacity
              style={{
                borderRadius: 100,
                backgroundColor: "rgba(0,0,0,0.1)",
                height: height * 0.08,
                width: height * 0.08,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setIsOpen(true)}
            >
              <AntDesign name="plus" size={28} color={"black"} />
            </TouchableOpacity>
          ) : (
            <View style={{ padding: 10 }}>
              <TouchableOpacity
                onPress={handleTerminateField}
                style={{
                  position: "absolute",
                  zIndex: 2,
                  elevation: 2,
                  top: 0,
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(224, 209, 172)",
                  padding: 4,
                  borderRadius: 100,
                  height: 30,
                  width: 30,
                }}
              >
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
              <TextInput
                value={value}
                multiline={true}
                numberOfLines={10}
                placeholder={"Type here..."}
                placeholderTextColor="#555"
                onChangeText={(value) => {
                  onChangeText?.(value);
                }}
                style={{
                  width: 320,
                  minHeight: 60,
                  height: "auto",
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 10,
                  backgroundColor: String(currentEmotion.color),
                  // Shadow
                  shadowColor: String(currentEmotion.color),
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                }}
              />
            </View>
          )}
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {selectedData.length > 0 && (
            <FlatList
              scrollEnabled={false}
              data={selectedData}
              renderItem={renderSelectedSelectable}
              contentContainerStyle={{
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 10,
              }}
            />
          )}
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() => {
              setIsSelectableModalOpen(true);
            }}
          >
            <AntDesign name="plus" size={18} color={"black"} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default JournalField;
