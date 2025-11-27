import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../utils/colors';

export default function DrawerMenu({ onSelect, onClose, onLogout, currentScreen, user }) {
  const items = [
    { key: 'Dashboard', label: 'Dashboard', icon: 'grid', description: 'Ringkasan utama' },
    { key: 'Prediction', label: 'Prediksi', icon: 'analytics', description: 'Cek risiko diabetes' },
    { key: 'HealthSummary', label: 'Ringkasan Kesehatan', icon: 'bar-chart', description: 'Data kesehatan Anda' },
    { key: 'Education', label: 'Edukasi', icon: 'book', description: 'Pelajari diabetes' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.appIconContainer}>
            <Ionicons name="water" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.appTitle}>Prediksi Pra-Diabetes</Text>
          <Text style={styles.appSubtitle}>Deteksi Dini dengan AI</Text>
        </View>

        {/* Profile Card */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => {
            onSelect && onSelect('Profile');
            onClose && onClose();
          }}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || "User"}</Text>
            <Text style={styles.email}>{user?.email || "-"}</Text>
            <View style={styles.profileBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#2ECC71" />
              <Text style={styles.badgeText}>Aktif</Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#4ECDC4" />
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuList}>
          <Text style={styles.sectionTitle}>MENU UTAMA</Text>
          
          {items.map((it) => (
            <TouchableOpacity
              key={it.key}
              style={[
                styles.menuItem,
                currentScreen === it.key && styles.menuItemActive
              ]}
              onPress={() => {
                onSelect && onSelect(it.key);
                onClose && onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={[
                styles.menuIconContainer,
                currentScreen === it.key && styles.menuIconContainerActive
              ]}>
                <Ionicons 
                  name={it.icon} 
                  size={22} 
                  color={currentScreen === it.key ? "#4ECDC4" : "#7F8C8D"} 
                />
              </View>
              
              <View style={styles.menuTextContainer}>
                <Text
                  style={[
                    styles.menuLabel,
                    currentScreen === it.key && styles.menuLabelActive
                  ]}
                >
                  {it.label}
                </Text>
                <Text style={styles.menuDescription}>{it.description}</Text>
              </View>

              {currentScreen === it.key && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Ionicons name="information-circle" size={18} color="#3498DB" />
          <Text style={styles.infoText}>
            Pantau kesehatan Anda secara rutin untuk deteksi dini pra-diabetes
          </Text>
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => onLogout && onLogout()}
            activeOpacity={0.7}
          >
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out" size={20} color="#E74C3C" />
            </View>
            <Text style={styles.logoutText}>Keluar dari Akun</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
  },
  scroll: {
    paddingBottom: 40,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5F5",
    marginBottom: 16,
  },
  appIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4ECDC4",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: "#2C3E50",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: "#E8F5F5",
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4ECDC4",
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontWeight: '800',
    color: "#2C3E50",
    fontSize: 16,
    marginBottom: 2,
  },
  email: {
    color: "#7F8C8D",
    fontSize: 12,
    marginBottom: 6,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: "#2ECC71",
  },
  menuList: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: "#95A5A6",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: "#E8F5F5",
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F9FF",
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconContainerActive: {
    backgroundColor: "#FFFFFF",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuLabel: {
    color: "#2C3E50",
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuLabelActive: {
    color: "#4ECDC4",
    fontWeight: '800',
  },
  menuDescription: {
    fontSize: 11,
    color: "#95A5A6",
  },
  activeIndicator: {
    position: 'absolute',
    right: 12,
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#4ECDC4",
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: "#E8F5F5",
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: "#2C3E50",
    fontWeight: '600',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#FFEBEE",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutText: {
    color: "#E74C3C",
    fontWeight: '700',
    fontSize: 15,
  },
});