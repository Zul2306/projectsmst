import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, StatusBar, Animated, Dimensions, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DrawerMenu from '../components/DrawerMenu';
import DashboardScreen from './DashboardScreen';
import PredictionScreen from './PredictionScreen';
import RecommendationScreen from './RecommendationScreen';
import SummaryScreen from './SummaryScreen';
import HistoryScreen from './HistoryScreen';
import ProfileScreen from './ProfileScreen';

import colors from '../utils/colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../utils/api";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

export default function MainLayout({ onLogout }) {

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [user, setUser] = useState(null);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Load profile user from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (err) {
        console.log("Failed to load user profile:", err);
      }
    };

    loadProfile();
  }, []);

  // Drawer Animation
  useEffect(() => {
    if (drawerVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 280,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 280,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [drawerVisible]);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'Dashboard': return 'Dashboard';
      case 'Prediction': return 'Prediksi Pra-Diabetes';
      case 'Recommendation': return 'Rekomendasi Makanan';
      case 'Summary': return 'Ringkasan Kesehatan';
      case 'History': return 'Riwayat Prediksi';
      case 'Profile': return 'Profil Saya';
      default: return 'Dashboard';
    }
  };

  const getScreenIcon = () => {
    switch (currentScreen) {
      case 'Dashboard': return 'grid';
      case 'Prediction': return 'analytics';
      case 'Recommendation': return 'restaurant';
      case 'Summary': return 'bar-chart';
      case 'History': return 'time';
      case 'Profile': return 'person';
      default: return 'grid';
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard': return <DashboardScreen />;
      case 'Prediction': return <PredictionScreen />;
      case 'Recommendation': return <RecommendationScreen />;
      case 'Summary': return <SummaryScreen />;
      case 'History': return <HistoryScreen />;
      case 'Profile': return <ProfileScreen user={user} onLogout={onLogout} />;
      default: return <DashboardScreen />;
    }
  };

  const closeDrawer = () => setDrawerVisible(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="menu" size={26} color="#2C3E50" />
          </View>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <View style={styles.headerIconBg}>
            <Ionicons name={getScreenIcon()} size={20} color="#4ECDC4" />
          </View>
          <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.healthBadge}>
            <Ionicons name="water" size={14} color="#4ECDC4" />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Drawer */}
      <Modal visible={drawerVisible} animationType="none" transparent onRequestClose={closeDrawer}>
        <View style={styles.modalContainer}>

          {/* Overlay */}
          <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeDrawer}/>
          </Animated.View>

          {/* Drawer panel */}
          <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
            <DrawerMenu
              user={user}
              onSelect={(screen) => {
                setCurrentScreen(screen);
                closeDrawer();
              }}
              onClose={closeDrawer}
              onLogout={onLogout}
              currentScreen={currentScreen}
            />
          </Animated.View>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5F5",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5F5",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: "#2C3E50",
  },
  headerRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F5F5",
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#FFFFFF",
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});