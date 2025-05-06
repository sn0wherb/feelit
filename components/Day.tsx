import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

interface Props {
  digit: number;
  bounds: "outside" | "inside";
  logReferenceIds: number[];
  passOpenDay: (logReferenceIds: number[]) => void;
}

const { width, height } = Dimensions.get("window");

const Day = ({ digit, bounds, logReferenceIds, passOpenDay }: Props) => {
  const data = logReferenceIds;

  return (
    <TouchableOpacity
      style={[styles[bounds]]}
      onPress={(logReferenceIds) => passOpenDay}
    >
      <Text style={styles.dayOutsideMonth}>{digit}</Text>
    </TouchableOpacity>
  );
};

export default Day;

const styles = StyleSheet.create({
  outside: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 2,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 20,
  },
  inside: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
  },
  dayOutsideMonth: {
    color: "#666",
  },
});
