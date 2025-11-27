// app/screens/RecommendationScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../utils/api';

export default function RecommendationScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    loadRecommendation();
  }, []);

  const loadRecommendation = async () => {
    setLoading(true);
    setRecommendation(null);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Notifikasi', 'Anda belum login. Silakan login untuk melihat rekomendasi.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/recommend/food`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        Alert.alert('Sesi kadaluarsa', 'Token Anda tidak valid atau telah kadaluarsa. Silakan login kembali.');
        // optionally remove token: await AsyncStorage.removeItem('token');
        setLoading(false);
        return;
      }

      if (res.status === 404) {
        // tidak ada prediksi / rekomendasi untuk user ini
        setRecommendation(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        Alert.alert('Error', `Gagal memuat rekomendasi. ${txt || ''}`);
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Normalize response shape (safety checks)
      const normalized = {
        status: data.status ?? 'success',
        prediction: (typeof data.prediction !== 'undefined') ? data.prediction : null,
        probability: (typeof data.probability !== 'undefined') ? data.probability : null,
        recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
        createdAt: data.createdAt ?? data.created_at ?? null,
      };

      setRecommendation(normalized);
    } catch (err) {
      console.log('loadRecommendation error', err);
      Alert.alert('Error', 'Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendation();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const getStatusInfo = () => {
    if (!recommendation) return null;

    const isDiabetes = recommendation.prediction === 1 || recommendation.prediction === 'Diabetes';
    return {
      title: isDiabetes ? 'Risiko Diabetes Terdeteksi' : 'Kondisi Sehat',
      color: isDiabetes ? '#E74C3C' : '#2ECC71',
      icon: isDiabetes ? 'warning' : 'checkmark-circle',
      message: isDiabetes
        ? 'Berikut rekomendasi makanan untuk membantu mengontrol gula darah Anda'
        : 'Berikut rekomendasi makanan untuk menjaga kesehatan Anda',
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Memuat rekomendasi...</Text>
      </View>
    );
  }

  if (!recommendation || recommendation.recommendations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="restaurant-outline" size={64} color="#B8B8B8" />
        </View>
        <Text style={styles.emptyText}>Belum Ada Rekomendasi</Text>
        <Text style={styles.emptySubtext}>
          Lakukan prediksi terlebih dahulu untuk mendapatkan rekomendasi makanan
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={loadRecommendation}>
          <Text style={styles.emptyButtonText}>Muat Ulang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="restaurant" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Rekomendasi Makanan</Text>
        <Text style={styles.headerSubtitle}>Berdasarkan hasil prediksi terakhir Anda</Text>
      </View>

      {/* Status Card */}
      <View style={[styles.statusCard, { backgroundColor: `${statusInfo.color}15` }]}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusIconContainer, { backgroundColor: statusInfo.color }]}>
            <Ionicons name={statusInfo.icon} size={28} color="#FFFFFF" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, { color: statusInfo.color }]}>{statusInfo.title}</Text>
            <Text style={styles.statusMessage}>{statusInfo.message}</Text>
          </View>
        </View>

        <View style={styles.statusDetails}>
          <View style={styles.statusDetailItem}>
            <Text style={styles.statusDetailLabel}>Probabilitas</Text>
            <Text style={[styles.statusDetailValue, { color: statusInfo.color }]}>
              {recommendation.probability !== null ? `${recommendation.probability}%` : '-'}
            </Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusDetailItem}>
            <Text style={styles.statusDetailLabel}>Tanggal</Text>
            <Text style={styles.statusDetailValue}>{formatDate(recommendation.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color="#3498DB" />
        <Text style={styles.infoText}>
          Rekomendasi ini dibuat oleh AI berdasarkan kondisi kesehatan Anda. Konsultasikan dengan ahli gizi untuk panduan lebih detail.
        </Text>
      </View>

      {/* Recommendations List */}
      <View style={styles.recommendationsSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="checkmark-done" size={20} color="#4ECDC4" />
          <Text style={styles.sectionTitle}>Menu yang Direkomendasikan</Text>
        </View>

        {recommendation.recommendations.map((item, index) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={styles.recommendationNumber}>
              <Text style={styles.recommendationNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
            <View style={styles.recommendationCheck}>
              <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
            </View>
          </View>
        ))}
      </View>

      {/* Tips Card */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb" size={22} color="#F39C12" />
          <Text style={styles.tipsTitle}>Tips Penting</Text>
        </View>

        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Ionicons name="water" size={16} color="#4ECDC4" />
            <Text style={styles.tipText}>Minum air putih minimal 8 gelas per hari</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="fitness" size={16} color="#2ECC71" />
            <Text style={styles.tipText}>Olahraga ringan 30 menit setiap hari</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="moon" size={16} color="#9B59B6" />
            <Text style={styles.tipText}>Tidur yang cukup 7-8 jam per malam</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="happy" size={16} color="#FF6B6B" />
            <Text style={styles.tipText}>Kelola stress dengan baik</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.refreshButton} onPress={loadRecommendation}>
          <Ionicons name="refresh" size={20} color="#4ECDC4" />
          <Text style={styles.refreshButtonText}>Perbarui Rekomendasi</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  statusCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  statusMessage: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '600',
    lineHeight: 18,
  },
  statusDetails: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  statusDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDetailLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDetailValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C3E50',
  },
  statusDivider: {
    width: 1,
    backgroundColor: '#E8F5F5',
    marginHorizontal: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#E8F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
    lineHeight: 18,
  },
  recommendationsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2C3E50',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4ECDC4',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    lineHeight: 20,
  },
  recommendationCheck: {
    marginLeft: 12,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2C3E50',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '600',
    lineHeight: 18,
  },
  actionButtons: {
    gap: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4ECDC4',
  },
});
