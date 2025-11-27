import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../utils/colors';

const { width } = Dimensions.get('window');

export default function SummaryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState(null);

  // Dummy data untuk preview
  const dummySummary = {
    total_predictions: 15,
    diabetes_count: 4,
    non_diabetes_count: 11,
    avg_probability: 35.7,
    avg_glucose: 125.3,
    avg_blood_pressure: 78.5,
    latest: {
      id: 1,
      prediction: 0,
      probability: 23.5,
      createdAt: '2024-01-15T10:30:00Z',
    },
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    // TODO: Implement API call
    // Simulasi loading
    setTimeout(() => {
      setSummary(dummySummary);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSummary();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const getPercentage = (count, total) => {
    if (total === 0) return 0;
    return ((count / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Memuat ringkasan...</Text>
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#B8B8B8" />
        <Text style={styles.emptyText}>Tidak ada data</Text>
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
          <Ionicons name="bar-chart" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Ringkasan Kesehatan</Text>
        <Text style={styles.headerSubtitle}>
          Overview data prediksi Anda
        </Text>
      </View>

      {/* Total Predictions Card */}
      <View style={styles.totalCard}>
        <View style={styles.totalIconContainer}>
          <Ionicons name="document-text" size={28} color="#4ECDC4" />
        </View>
        <Text style={styles.totalLabel}>Total Prediksi</Text>
        <Text style={styles.totalValue}>{summary.total_predictions}</Text>
        <Text style={styles.totalSubtext}>Prediksi yang telah dilakukan</Text>
      </View>

      {/* Prediction Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.cardTitle}>
          <Ionicons name="pie-chart" size={16} color="#4ECDC4" /> Breakdown Hasil
        </Text>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
            </View>
            <Text style={styles.breakdownValue}>{summary.non_diabetes_count}</Text>
            <Text style={styles.breakdownLabel}>Tidak Diabetes</Text>
            <View style={styles.percentageBadge}>
              <Text style={[styles.percentageText, { color: '#2ECC71' }]}>
                {getPercentage(summary.non_diabetes_count, summary.total_predictions)}%
              </Text>
            </View>
          </View>

          <View style={styles.breakdownDivider} />

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownIconContainer}>
              <Ionicons name="warning" size={24} color="#E74C3C" />
            </View>
            <Text style={styles.breakdownValue}>{summary.diabetes_count}</Text>
            <Text style={styles.breakdownLabel}>Diabetes</Text>
            <View style={styles.percentageBadge}>
              <Text style={[styles.percentageText, { color: '#E74C3C' }]}>
                {getPercentage(summary.diabetes_count, summary.total_predictions)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Average Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>
          <Ionicons name="analytics" size={16} color="#4ECDC4" /> Rata-rata Indikator
        </Text>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Ionicons name="water" size={20} color="#E74C3C" />
            </View>
            <Text style={styles.statLabel}>Glukosa</Text>
            <Text style={styles.statValue}>
              {summary.avg_glucose?.toFixed(1) || '-'}
            </Text>
            <Text style={styles.statUnit}>mg/dL</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Ionicons name="heart-circle" size={20} color="#FF6B6B" />
            </View>
            <Text style={styles.statLabel}>Tekanan Darah</Text>
            <Text style={styles.statValue}>
              {summary.avg_blood_pressure?.toFixed(1) || '-'}
            </Text>
            <Text style={styles.statUnit}>mmHg</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Ionicons name="trending-up" size={20} color="#3498DB" />
            </View>
            <Text style={styles.statLabel}>Probabilitas</Text>
            <Text style={styles.statValue}>
              {summary.avg_probability?.toFixed(1) || '-'}
            </Text>
            <Text style={styles.statUnit}>%</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Ionicons name="pulse" size={20} color="#9B59B6" />
            </View>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={[
              styles.statValue,
              { 
                fontSize: 14,
                color: summary.avg_probability > 50 ? '#E74C3C' : '#2ECC71' 
              }
            ]}>
              {summary.avg_probability > 50 ? 'Risiko' : 'Aman'}
            </Text>
            <Text style={styles.statUnit}>Rata-rata</Text>
          </View>
        </View>
      </View>

      {/* Latest Prediction */}
      {summary.latest && (
        <View style={styles.latestCard}>
          <View style={styles.latestHeader}>
            <View style={styles.latestIconContainer}>
              <Ionicons name="time" size={20} color="#4ECDC4" />
            </View>
            <Text style={styles.cardTitle}>Prediksi Terakhir</Text>
          </View>

          <View style={styles.latestContent}>
            <View style={styles.latestDateSection}>
              <Ionicons name="calendar" size={16} color="#7F8C8D" />
              <Text style={styles.latestDate}>
                {formatDate(summary.latest.createdAt)}
              </Text>
            </View>

            <View style={styles.latestResultSection}>
              <View style={[
                styles.latestResultBadge,
                summary.latest.prediction === 1 
                  ? styles.latestResultDanger 
                  : styles.latestResultSuccess
              ]}>
                <Ionicons 
                  name={summary.latest.prediction === 1 ? "warning" : "checkmark-circle"} 
                  size={24} 
                  color="#FFFFFF" 
                />
                <View>
                  <Text style={styles.latestResultLabel}>
                    {summary.latest.prediction === 1 ? 'Diabetes' : 'Tidak Diabetes'}
                  </Text>
                  <Text style={styles.latestResultProb}>
                    Probabilitas: {summary.latest.probability}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Health Recommendation */}
      <View style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <Ionicons name="medical" size={22} color="#3498DB" />
          <Text style={styles.recommendationTitle}>Rekomendasi</Text>
        </View>
        <Text style={styles.recommendationText}>
          {summary.avg_probability > 50 
            ? '⚠️ Probabilitas risiko tinggi. Konsultasikan dengan dokter untuk pemeriksaan lebih lanjut.'
            : '✅ Probabilitas risiko rendah. Tetap jaga pola hidup sehat dan lakukan pemeriksaan rutin.'}
        </Text>
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
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#7F8C8D",
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
  totalCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E8F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 48,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
  },
  totalSubtext: {
    fontSize: 12,
    color: "#95A5A6",
  },
  breakdownCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
  },
  breakdownIconContainer: {
    marginBottom: 12,
  },
  breakdownValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 8,
  },
  percentageBadge: {
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "800",
  },
  breakdownDivider: {
    width: 1,
    height: 80,
    backgroundColor: "#E8F5F5",
    marginHorizontal: 12,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#F0F9FF",
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 10,
    color: "#95A5A6",
  },
  latestCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  latestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  latestIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5F5",
    justifyContent: 'center',
    alignItems: 'center',
  },
  latestContent: {
    gap: 12,
  },
  latestDateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  latestDate: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "600",
  },
  latestResultSection: {
    marginTop: 4,
  },
  latestResultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
  },
  latestResultSuccess: {
    backgroundColor: "#2ECC71",
  },
  latestResultDanger: {
    backgroundColor: "#E74C3C",
  },
  latestResultLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  latestResultProb: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  recommendationCard: {
    backgroundColor: "#E8F5F5",
    padding: 20,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2C3E50",
  },
  recommendationText: {
    fontSize: 13,
    color: "#2C3E50",
    fontWeight: "600",
    lineHeight: 20,
  },
});