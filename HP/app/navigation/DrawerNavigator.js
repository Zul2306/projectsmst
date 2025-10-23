import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../screens/DashboardScreen";
import ConsultationScreen from "../screens/ConsultationScreen";
import InputDataScreen from "../screens/InputDataScreen";
import HealthSummaryScreen from "../screens/HealthSummaryScreen";
import RemindersScreen from "../screens/RemindersScreen";
import RecommendationsScreen from "../screens/RecommendationsScreen";
import EducationScreen from "../screens/EducationScreen";
import UserProfile from "../components/UserProfile";
import MenuItem from "../components/MenuItem";
import colors from "../utils/colors";

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation, state }) {
  const routes = [
    { name: "Dashboard", icon: "grid-outline", title: "Dashboard" },
    {
      name: "Consultation",
      icon: "chatbubbles-outline",
      title: "Konsultasi & Rekomendasi",
    },
    { name: "InputData", icon: "create-outline", title: "Input Data Pasien" },
    {
      name: "HealthSummary",
      icon: "bar-chart-outline",
      title: "Health Summary",
    },
    { name: "Reminders", icon: "notifications-outline", title: "Reminders" },
    { name: "Recommendations", icon: "bulb-outline", title: "Recommendations" },
    { name: "Education", icon: "book-outline", title: "Education" },
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <UserProfile name="John Doe" email="john@example.com" />
      </View>

      <ScrollView
        style={styles.drawerContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuSection}>
          {routes.map((route, index) => (
            <MenuItem
              key={route.name}
              icon={route.icon}
              title={route.title}
              isActive={state.index === index}
              onPress={() => navigation.navigate(route.name)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 300,
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Consultation" component={ConsultationScreen} />
      <Drawer.Screen name="InputData" component={InputDataScreen} />
      <Drawer.Screen name="HealthSummary" component={HealthSummaryScreen} />
      <Drawer.Screen name="Reminders" component={RemindersScreen} />
      <Drawer.Screen name="Recommendations" component={RecommendationsScreen} />
      <Drawer.Screen name="Education" component={EducationScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  drawerHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuSection: {
    marginBottom: 20,
  },
});
