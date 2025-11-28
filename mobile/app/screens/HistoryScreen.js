// app/screens/HistoryScreen.js
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

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);
  const [limit] = useState(10); // default sesuai route backend
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [offset]);

  const loadHistory = async (reset = true) => {
    if (reset) {
      setLoading(true);
      setOffset(0);
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token tidak ditemukan. Silakan login ulang.');
        setHistory([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/history/?limit=${limit}&offset=${reset ? 0 : offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        Alert.alert('Error', 'Sesi berakhir. Silakan login ulang.');
        setHistory([]);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.log('History fetch error', err);
        Alert.alert('Error', err.detail || 'Gagal memuat riwayat');
        setHistory([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.log('Unexpected history response', data);
        setHistory([]);
        setLoading(false);
        return;
      }

      if (reset) {
        setHistory(data);
      } else {
        setHistory((prev) => [...prev, ...data]);
      }

      // jika jumlah data < limit, berarti tidak ada lagi
      setHasMore(data.length === limit);
    } catch (e) {
      console.log('loadHistory exception', e);
      Alert.alert('Error', 'Tidak dapat terhubung ke server');
      setHistory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory(true);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setOffset((prev) => prev + limit);
    // loadHistory triggered by offset change
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return date.toLocaleDateString('id-ID', options);
    } catch {
      return dateString;
    }
  };

  const fetchDetail = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token tidak ditemukan. Silakan login ulang.');
        return;
      }
      const res = await fetch(`${API_URL}/history/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Error', err.detail || 'Gagal memuat detail');
        return;
      }

      const item = await res.json();
      Alert.alert('Detail Prediksi', JSON.stringify(item, null, 2));
      // TODO: ganti Alert dengan navigasi ke detail screen jika ada
    } catch (e) {
      console.log('fetchDetail exception', e);
      Alert.alert('Error', 'Tidak dapat terhubung ke server');
    }
  };

  const renderHistoryItem = (item) => {
    const isDiabetes = item.prediction === 1 || item.prediction === '1' || item.prediction === 'Diabetes';

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.historyCard}
        activeOpacity={0.7}
      >
        <View style={styles.historyHeader}>
          <View style={[
            styles.resultBadge,
            isDiabetes ? styles.resultBadgeDanger : styles.resultBadgeSuccess
          ]}>
            <Ionicons
              name={isDiabetes ? "warning" : "checkmark-circle"}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.resultBadgeText}>
              {isDiabetes ? 'Diabetes' : 'Tidak Diabetes'}
            </Text>
          </View>

          <Text style={styles.dateText}>
            {formatDate(item.createdAt)}
          </Text>
        </View>

        <View style={styles.probabilitySection}>
          <Text style={styles.probabilityLabel}>Probabilitas</Text>
          <Text style={[
            styles.probabilityValue,
            { color: isDiabetes ? '#E74C3C' : '#2ECC71' }
          ]}>
            {typeof item.probability === 'number' ? item.probability.toFixed(1) : item.probability}%
          </Text>
        </View>

        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <View style={styles.dataIconContainer}>
              <Ionicons name="water" size={16} color="#E74C3C" />
            </View>
            <Text style={styles.dataLabel}>Glukosa</Text>
            <Text style={styles.dataValue}>{item.glucose ?? '-'}</Text>
          </View>

          <View style={styles.dataItem}>
            <View style={styles.dataIconContainer}>
              <Ionicons name="heart-circle" size={16} color="#FF6B6B" />
            </View>
            <Text style={styles.dataLabel}>TD</Text>
            <Text style={styles.dataValue}>{item.blood_pressure ?? '-'}</Text>
          </View>

          <View style={styles.dataItem}>
            <View style={styles.dataIconContainer}>
              <Ionicons name="fitness" size={16} color="#95E1D3" />
            </View>
            <Text style={styles.dataLabel}>BMI</Text>
            <Text style={styles.dataValue}>{item.bmi ?? '-'}</Text>
          </View>

          <View style={styles.dataItem}>
            <View style={styles.dataIconContainer}>
              <Ionicons name="people" size={16} color="#4ECDC4" />
            </View>
            <Text style={styles.dataLabel}>Hamil</Text>
            <Text style={styles.dataValue}>{item.pregnancies ?? '-'}</Text>
          </View>
        </View>

        {/* <TouchableOpacity
          style={styles.detailButton}
          onPress={() => fetchDetail(item.id)}
        >
          <Text style={styles.detailButtonText}>Lihat Detail</Text>
          <Ionicons name="chevron-forward" size={16} color="#4ECDC4" />
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };

  if (loading && history.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Memuat riwayat...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onMomentumScrollEnd={() => {
        // saat scroll mencapai bottom, coba load more
        // Note: ini simple; kalau butuh infinite scroll lebih stabil, gunakan FlatList + onEndReached
        if (hasMore && !loading) loadMore();
      }}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="time" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Riwayat Prediksi</Text>
        <Text style={styles.headerSubtitle}>
          Semua hasil prediksi pra-diabetes Anda
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={20} color="#4ECDC4" />
          <Text style={styles.statValue}>{history.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
          <Text style={styles.statValue}>
            {history.filter(h => Number(h.prediction) === 0).length}
          </Text>
          <Text style={styles.statLabel}>Negatif</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="warning" size={20} color="#E74C3C" />
          <Text style={styles.statValue}>
            {history.filter(h => Number(h.prediction) === 1).length}
          </Text>
          <Text style={styles.statLabel}>Positif</Text>
        </View>
      </View>

      <View style={styles.historyList}>
        <Text style={styles.sectionTitle}>RIWAYAT PREDIKSI</Text>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#B8B8B8" />
            <Text style={styles.emptyText}>Belum ada riwayat prediksi</Text>
            <Text style={styles.emptySubtext}>
              Lakukan prediksi pertama Anda untuk melihat riwayat
            </Text>
          </View>
        ) : (
          history.map((item) => renderHistoryItem(item))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "600",
  },
  historyList: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#95A5A6",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultBadgeSuccess: {
    backgroundColor: "#2ECC71",
  },
  resultBadgeDanger: {
    backgroundColor: "#E74C3C",
  },
  resultBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  dateText: {
    fontSize: 11,
    color: "#95A5A6",
    fontWeight: "600",
  },
  probabilitySection: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5F5",
    marginBottom: 16,
  },
  probabilityLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 4,
  },
  probabilityValue: {
    fontSize: 32,
    fontWeight: "800",
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  dataItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: "#F0F9FF",
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  dataIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dataLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "800",
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: "#E8F5F5",
    borderRadius: 10,
  },
  detailButtonText: {
    fontSize: 13,
    color: "#4ECDC4",
    fontWeight: "700",
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7F8C8D",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#95A5A6",
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
