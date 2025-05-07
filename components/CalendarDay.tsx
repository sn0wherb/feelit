import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
};

interface Props {
  data: LogType[] | undefined;
  onReturn: () => void;
}

const CalendarDay = ({ data, onReturn }: Props) => {
  if (!data || !data[0]) {
    return (
      <View>
        <Text>No logs on this day.</Text>
        <Button title="Go back" onPress={onReturn} />
      </View>
    );
  }

  return (
    <View>
      <Text style={{ backgroundColor: data[0].color }}>{data[0].emotion}</Text>
      <Button title="Go back" onPress={onReturn} />
    </View>
  );
};

export default CalendarDay;

const styles = StyleSheet.create({});
