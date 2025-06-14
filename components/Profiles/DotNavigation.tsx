import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { keyExtractor } from "@/assets/functions";

interface Props {
  items: EmotionType[];
  selected: number;
}

const { width, height } = Dimensions.get("window");

const DotNavigation = ({ items, selected }: Props) => {
  console.log(selected);
  // ---------------------
  // FUNCTIONS
  // ---------------------
  const renderDots = ({
    item,
    index,
  }: {
    item: EmotionType;
    index: number;
  }) => {
    if (index == selected) {
      return (
        <View
          style={{
            padding: 8,
            borderRadius: 30,
            backgroundColor: item.color,
            width: width * 0.46,
            height: height * 0.07,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22, textAlign: "center" }}>{item.name}</Text>
        </View>
      );
    } else {
      let dotSize = 0;
      if (index == selected + 1 || index == selected - 1) {
        dotSize = width * 0.03;
      } else if (index == selected + 2 || index == selected - 2) {
        dotSize = width * 0.022;
      } else {
        dotSize = width * 0.016;
      }

      return (
        <View
          style={{
            width: dotSize,
            height: dotSize,
            borderColor: "rgba(0,0,0,0.1)",
            borderRadius: 999,
            backgroundColor: item.color,
          }}
        />
      );
    }
  };

  // ---------------------
  // COMPONENT
  // ---------------------
  return (
    <View style={{ position: "absolute", zIndex: 1, top: height * 0.04 }}>
      <FlatList
        scrollEnabled={false}
        horizontal
        contentContainerStyle={{
          width: width,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
        data={items}
        renderItem={renderDots}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default DotNavigation;

const styles = StyleSheet.create({});
