import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const about = () => {
  // ---------------------
  // CONSTS
  // ---------------------
  const router = useRouter();

  // ---------------------
  // COMPONENT
  // ---------------------
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>About Feelit</Text>
      </View>
      <Text style={styles.aboutText}>
        Feelit is an open source solo project by me,{" "}
        <Text style={{ fontWeight: "bold" }}>sn0wherb</Text>.
      </Text>
      <Text style={styles.aboutText}>
        With this app, I set out to make a mood tracker/emotion diary that is
        not only simple and personizable, but also puts a big emphasis on the
        rapidly developing psychosomatic field in medicine.
      </Text>
      <Text style={styles.aboutText}>
        For any feedback or suggestions, please contact me at{" "}
        <Text style={{ fontWeight: "bold" }}>sn0wherb@gmail.com</Text>.
      </Text>
      <Text style={styles.aboutText}>Thank you for using Feelit! ❤︎</Text>
    </SafeAreaView>
  );
};

export default about;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: "beige",
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    gap: width * 0.04,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingButton: {
    height: height * 0.1,
    paddingLeft: width * 0.16,
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.04,
  },
  settingButtonText: {
    fontSize: 20,
  },
  aboutText: {
    fontSize: 18,
    padding: 20,
  },
});
