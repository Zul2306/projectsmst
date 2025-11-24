import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, StatusBar, Animated, Dimensions, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DrawerMenu from '../components/DrawerMenu';
import DashboardScreen from './DashboardScreen';
import ClassificationScreen from './ClassificationScreen';
import HealthSummaryScreen from './HealthSummaryScreen';
import EducationScreen from './EducationScreen';
import ProfileScreen from './ProfileScreen';
import colors from '../utils/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

export default function MainLayout({ onLogout }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (drawerVisible) {
      // Buka drawer dengan easing yang smooth
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
      // Tutup drawer dengan easing yang smooth
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
      case 'Dashboard':
        return 'Diabetes Risk App';
      case 'Classification':
        return 'Input Data Pasien';
      case 'HealthSummary':
        return 'Health Summary';
      case 'Education':
        return 'Education';
      case 'Profile':
        return 'Profile';
      default:
        return 'Diabetes Risk App';
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen />;
      case 'Classification':
        return <ClassificationScreen />;
      case 'HealthSummary':
        return <HealthSummaryScreen />;
      case 'Education':
        return <EducationScreen />;
      case 'Profile':
        return <ProfileScreen onLogout={onLogout} />;
      default:
        return <DashboardScreen />;
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setDrawerVisible(true)}
        >
          <Ionicons name="menu" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        <View style={styles.menuButton} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Drawer Modal */}
      <Modal
        visible={drawerVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeDrawer}
      >
        <View style={styles.modalContainer}>
          {/* Overlay dengan animasi opacity */}
          <Animated.View 
            style={[
              styles.overlay,
              {
                opacity: overlayAnim,
              }
            ]}
          >
            <TouchableOpacity 
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeDrawer}
            />
          </Animated.View>

          {/* Drawer dengan animasi slide */}
          <Animated.View 
            style={[
              styles.drawerContainer,
              {
                transform: [{ translateX: slideAnim }],
              }
            ]}
          >
            <DrawerMenu
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
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
    backgroundColor: colors.card,
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