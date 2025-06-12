import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Calendar from "@/components/Calendar/Calendar";
import MostFrequentEmotions from "@/components/Analytics/MostFrequentEmotions";

const { height, width } = Dimensions.get("window");

const analytics = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        pagingEnabled
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        {/* Calendar */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Calendar />
        </View>
        {/* Top Emotions */}
        <View style={{ padding: 20, height: height * 0.8 }}>
          <MostFrequentEmotions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default analytics;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "beige",
  },
});
