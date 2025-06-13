import {
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

const { width, height } = Dimensions.get("window");

const settings = () => {
  // ---------------------
  // CONSTS
  // ---------------------
  const router = useRouter();

  // ---------------------
  // FUNCTIONS
  // ---------------------
  const openPanel = (title: "about") => {
    router.push(`/settings/${title}`);
  };

  // ---------------------
  // COMPONENT
  // ---------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => openPanel("about")}
        >
          <Feather name="info" size={24} color="black" />
          <Text style={styles.settingButtonText}>About</Text>
        </TouchableOpacity>
        <View style={styles.settingButton}>
          <Text style={{ color: "gray", fontSize: 18 }}>Version: 1.0.0</Text>
        </View>
      </ScrollView>
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
  settingButton: {
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingButtonText: {
    fontSize: 20,
  },
});
