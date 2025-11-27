import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../utils/colors';

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);

  // Dummy data untuk preview
  const dummyHistory = [
    {
      id: 1,
      pregnancies: 2,
      glucose: 120,
      blood_pressure: 80,
      bmi: 25.3,
      dpf: 0.5,
      prediction: 0,
      probability: 23.5,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      pregnancies: 3,
      glucose: 145,
      blood_pressure: 85,
      bmi: 28.7,
      dpf: 0.7,
      prediction: 1,
      probability: 78.2,
      createdAt: '2024-01-14T14:20:00Z',
    },
    {
      id: 3,
      pregnancies: 1,
      glucose: 110,
      blood_pressure: 75,
      bmi: 23.1,
      dpf: 0.4,
      prediction: 0,
      probability: 15.8,
      createdAt: '2024-01-10T09:15:00Z',
    },
  ];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    // TODO: Implement API call
    // Simulasi loading
    setTimeout(() => {
      setHistory(dummyHistory);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const renderHistoryItem = (item) => {
    const isDiabetes = item.prediction === 1;
    
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.historyCard}
        activeOpacity={0.7}
      >
        {/* Header */}
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

        {/* Probability */}
        <View style={styles.probabilitySection}>
          <Text style={styles.probabilityLabel}>Probabilitas</Text>
          <Text style={[
            styles.probabilityValue,
            { color: isDiabetes ? '#E74C3C' : '#2ECC71' }
          ]}>
            {item.probability}%
          </Text>
        </View>

        {/* Data Summary */}
        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <View style={styles.dataIconContainer}>
              <Ionicons name="water" size={16} color="#E74C3C" />
            </View>
            <Text style={styles.dataLabel}>Glukosa</Text>
            <Text style={styles.dataValue}>{item.glucose}</Text>
          </View>

          <View style={styles.dataItem}>
            <View style={styles.dataIconContainer}>
              <Ionicons name="heart-circle" size={16} color="#FF6B6B" />
            </View>
            <Text style={styles.dataLabel}>TD</Text>
            <Text style={styles.dataValue}>{item.blood_pressure}</Text>
          </View>

          <View style={styles.dataItem}>
            <View style={styles.dataIconContainer}>
              <Ionicons name="fitness" size={16} color="#95E1D3" />
            </View>
            <Text style={styles.dataLabel}>BMI</Text>
            <Text style={styles.dataValue}>{item.bmi}</Text>
          </View>

          <View style={styles.dataItem}>
            <View style={styles.dataIconContainer}>
              <Ionicons name="people" size={16} color="#4ECDC4" />
            </View>
            <Text style={styles.dataLabel}>Hamil</Text>
            <Text style={styles.dataValue}>{item.pregnancies}</Text>
          </View>
        </View>

        {/* View Detail Button */}
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Lihat Detail</Text>
          <Ionicons name="chevron-forward" size={16} color="#4ECDC4" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
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
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="time" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Riwayat Prediksi</Text>
        <Text style={styles.headerSubtitle}>
          Semua hasil prediksi pra-diabetes Anda
        </Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={20} color="#4ECDC4" />
          <Text style={styles.statValue}>{history.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
          <Text style={styles.statValue}>
            {history.filter(h => h.prediction === 0).length}
          </Text>
          <Text style={styles.statLabel}>Negatif</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="warning" size={20} color="#E74C3C" />
          <Text style={styles.statValue}>
            {history.filter(h => h.prediction === 1).length}
          </Text>
          <Text style={styles.statLabel}>Positif</Text>
        </View>
      </View>

      {/* History List */}
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