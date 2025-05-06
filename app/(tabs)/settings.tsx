import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Updates from "expo-updates";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import PagerView from "react-native-pager-view";

const { width, height } = Dimensions.get("window");

const settings = () => {
  const db = useSQLiteContext();

  const dropLogs = async () => {
    try {
      await db.execAsync("DROP TABLE emotion_logs;");
    } catch (e) {
      console.error(e);
    }
  };

  const dropCustomEmotions = async () => {
    try {
      await db.execAsync(`
        ALTER TABLE user_created_emotions
        ADD COLUMN isCustom INTEGER DEFAULT 1
        `);
    } catch (e) {
      console.error(e);
    }
  };

  const testFunction = () => {
    console.log("date: ", new Date(Date.UTC(2025, 0, 1)));
  };

  useFocusEffect(
    useCallback(() => {
      // testFunction();
    }, [])
  );

  const [testData, setTestData] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    0,
    1,
    2,
  ]);
  const [scrollToMiddle, setScrollToMiddle] = useState(0);

  const handleViewableItemsChanged = (viewableItems) => {
    if (viewableItems.changed[0].index == 6) {
      setScrollToMiddle((scrollToMiddle) => scrollToMiddle + 1);
      let data = testData;
      data[viewableItems.changed[0].index - 1] =
        viewableItems.changed[0].item - 1;
      console.log(data);
      // data.pop();
      setTestData(data);
    }
  };

  // Problem: this happens before the flatlist renders
  useEffect(() => {
    flatListRef.current?.forceUpdate();
    // flatListRef.current?.scrollToIndex({
    //   index: 1,
    //   animated: false,
    // });
  }, [scrollToMiddle]);

  const flatListRef = useRef<FlatList>(null);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableHighlight
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={Updates.reloadAsync}
        >
          <Text>Reload app</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.button, { backgroundColor: "blue" }]}
          onPress={dropLogs}
        >
          <Text>Drop log table</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.button, { backgroundColor: "dodgerblue" }]}
          onPress={dropCustomEmotions}
        >
          <Text>Drop custom emotions table</Text>
        </TouchableHighlight>
        {/* FlatList */}
        <FlatList
          ref={flatListRef}
          data={testData}
          horizontal
          pagingEnabled
          initialScrollIndex={7}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: width,
                  height: height * 0.2,
                  backgroundColor: `#${item}F${item}`,
                }}
              >
                <Text>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: "beige",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    marginTop: 20,
    marginHorizontal: 30,
    borderRadius: 10,
    fontSize: 24,
  },
});
