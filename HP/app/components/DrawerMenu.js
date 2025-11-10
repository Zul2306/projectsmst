import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../utils/colors';

export default function DrawerMenu({ onSelect, onClose, onLogout, currentScreen }) {
  const items = [
    { key: 'Dashboard', label: 'Dashboard', icon: 'grid-outline' },
    { key: 'Classification', label: 'Klasifikasi', icon: 'create-outline' },
    { key: 'HealthSummary', label: 'Health Summary', icon: 'bar-chart-outline' },
    { key: 'Education', label: 'Education', icon: 'book-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Card - Clickable */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => {
            onSelect && onSelect('Profile');
            onClose && onClose();
          }}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john@example.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <View style={styles.menuList}>
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
            >
              <View style={styles.menuIcon}>
                <Ionicons 
                  name={it.icon} 
                  size={22} 
                  color={currentScreen === it.key ? colors.primary : colors.text} 
                />
              </View>
              <Text style={[
                styles.menuLabel,
                currentScreen === it.key && styles.menuLabelActive
              ]}>
                {it.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => onLogout && onLogout()}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  scroll: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.primary}25`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 16
  },
  email: {
    color: colors.textLight,
    marginTop: 4,
    fontSize: 13,
  },
  menuList: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  menuIcon: {
    width: 36,
    alignItems: 'center',
  },
  menuLabel: {
    color: colors.text,
    fontSize: 15,
    flex: 1,
  },
  menuItemActive: {
    backgroundColor: `${colors.primary}15`,
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: '600'
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 4
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.danger}15`,
    padding: 12,
    borderRadius: 12
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '600'
  }
});