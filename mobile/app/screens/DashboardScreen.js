import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HealthCard from "../components/HealthCard";
import StatusBadge from "../components/StatusBadge";
import ChartCard from "../components/ChartCard";
import colors from "../utils/colors";

export default function DashboardScreen({ navigation }) {
  const bloodSugarData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [
      {
        data: [120, 115, 125, 118, 122, 119, 117],
      },
    ],
  };

  const activityData = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        data: [30, 35, 42, 38, 45, 50, 55],
      },
    ],
  };

  const mealData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [
      {
        data: [1800, 2000, 1850, 1900, 2100, 1950, 2050],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Diabetes Risk Prediction</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Health Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Kesehatan Anda</Text>
          <View style={styles.healthCards}>
            <HealthCard value="130" label="Gula darah" unit="mg/dL" />
            <HealthCard value="24.8" label="BMI" />
            <HealthCard value="45" label="Min/hari" />
            <HealthCard value="500" label="Kalori" />
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <StatusBadge status="Sehat" />
        </View>

        {/* Health Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tracking</Text>
          <ChartCard title="Gula Darah" data={bloodSugarData} type="line" />
          <ChartCard title="Aktivitas" data={activityData} type="line" />
          <ChartCard title="Makanan" data={mealData} type="bar" />
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengingat</Text>
          <TouchableOpacity style={styles.reminderCard}>
            <View style={styles.reminderIcon}>
              <Ionicons name="water" size={24} color={colors.primary} />
            </View>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>Periksa gula darah</Text>
              <Text style={styles.reminderSubtitle}>Hari ini</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.reminderCard}>
            <View style={styles.reminderIcon}>
              <Ionicons name="fitness" size={24} color={colors.success} />
            </View>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>
                Tips untuk mengurangi risiko
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>
        </View>

        {/* Informasi Berguna */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi berguna</Text>
          <TouchableOpacity style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="restaurant" size={24} color={colors.warning} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Rekomendasi</Text>
              <Text style={styles.infoSubtitle}>Diet & aktivitas</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="school" size={24} color={colors.secondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Pendidikan</Text>
              <Text style={styles.infoSubtitle}>Baca artikel</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  healthCards: {
    flexDirection: "row",
    marginHorizontal: -4,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  reminderSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
});
