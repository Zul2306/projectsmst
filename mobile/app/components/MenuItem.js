import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../utils/colors";


export default function MenuItem({ icon, title, subtitle, onPress, isActive }) {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, isActive && styles.activeIcon]}>
        <Ionicons
          name={icon}
          size={24}
          color={isActive ? colors.primary : colors.textLight}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isActive && styles.activeText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  activeContainer: {
    backgroundColor: `${colors.primary}15`,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activeIcon: {
    backgroundColor: `${colors.primary}20`,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
  },
  activeText: {
    color: colors.primary,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
});
