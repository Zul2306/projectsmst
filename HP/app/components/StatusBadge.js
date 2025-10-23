import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../utils/colors";

export default function StatusBadge({ status }) {
  const isHealthy = status.toLowerCase() === "sehat";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isHealthy ? colors.success : colors.warning },
      ]}
    >
      <Text style={styles.text}>Status: {status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
