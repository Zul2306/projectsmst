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

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  // Dummy data untuk preview
  const dummyDashboard = {
    user: {
      total_predictions: 12,
      diabetes_count: 3,
      non_diabetes_count: 9,
      avg_probability: 32.5,
      last_prediction: {
        id: 1,
        user_id: 1,
        pregnancies: 2,
        glucose: 120,
        blood_pressure: 80,
        bmi: 25.3,
        dpf: 0.5,
        prediction: 0,
        probability: 23.5,
        createdAt: '2024-01-15T10:30:00Z',
      },
    },
    global_stats: {
      total_users: 150,
      total_predictions: 450,
      global_diabetes_rate: 35.6,
      avg_probability: 38.2,
    },
    recent_user_predictions: [
      {
        id: 1,
        user_id: 1,
        prediction: 0,
        probability: 23.5,
        glucose: 120,
        bmi: 25.3,
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 2,
        user_id: 1,
        prediction: 1,
        probability: 78.2,
        glucose: 145,
        bmi: 28.7,
        createdAt: '2024-01-14T14:20:00Z',
      },
    ],
    recent_global_predictions: [
      {
        id: 5,
        user_id: 3,
        user_name: 'John Doe',
        prediction: 0,
        probability: 15.8,
        glucose: 110,
        bmi: 23.1,
        createdAt: '2024-01-15T11:00:00Z',
      },
      {
        id: 6,
        user_id: 5,
        user_name: 'Jane Smith',
        prediction: 1,
        probability: 82.3,
        glucose: 155,
        bmi: 31.2,
        createdAt: '2024-01-15T10:45:00Z',
      },
    ],
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    // TODO: Implement API call
    // Simulasi loading
    setTimeout(() => {
      setDashboard(dummyDashboard);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Memuat dashboard...</Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#B8B8B8" />
        <Text style={styles.emptyText}>Tidak ada data</Text>
      </View>
    );
  }

  const { user, global_stats, recent_user_predictions, recent_global_predictions } = dashboard;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Selamat Datang! 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            Pantau kesehatan Anda dengan mudah
          </Text>
        </View>
        <View style={styles.welcomeIcon}>
          <Ionicons name="heart-circle" size={56} color="#4ECDC4" />
        </View>
      </View>

      {/* User Stats */}
      <View style={styles.sectionHeader}>
        <Ionicons name="person" size={20} color="#4ECDC4" />
        <Text style={styles.sectionTitle}>Statistik Anda</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="document-text" size={24} color="#4ECDC4" />
          </View>
          <Text style={styles.statValue}>{user.total_predictions}</Text>
          <Text style={styles.statLabel}>Total Prediksi</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
          </View>
          <Text style={styles.statValue}>{user.non_diabetes_count}</Text>
          <Text style={styles.statLabel}>Negatif</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="warning" size={24} color="#E74C3C" />
          </View>
          <Text style={styles.statValue}>{user.diabetes_count}</Text>
          <Text style={styles.statLabel}>Positif</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trending-up" size={24} color="#3498DB" />
          </View>
          <Text style={styles.statValue}>
            {user.avg_probability ? `${user.avg_probability.toFixed(1)}%` : '-'}
          </Text>
          <Text style={styles.statLabel}>Rata-rata</Text>
        </View>
      </View>

      {/* Last Prediction */}
      {user.last_prediction && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons name="pulse" size={20} color="#4ECDC4" />
            <Text style={styles.sectionTitle}>Prediksi Terakhir</Text>
          </View>

          <View style={styles.lastPredictionCard}>
            <View style={styles.lastPredHeader}>
              <View style={[
                styles.lastPredBadge,
                user.last_prediction.prediction === 1
                  ? styles.lastPredBadgeDanger
                  : styles.lastPredBadgeSuccess
              ]}>
                <Ionicons
                  name={user.last_prediction.prediction === 1 ? "warning" : "checkmark-circle"}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.lastPredBadgeText}>
                  {user.last_prediction.prediction === 1 ? 'Diabetes' : 'Tidak Diabetes'}
                </Text>
              </View>
              <Text style={styles.lastPredDate}>
                {formatDate(user.last_prediction.createdAt)}
              </Text>
            </View>

            <View style={styles.lastPredProb}>
              <Text style={styles.lastPredProbLabel}>Probabilitas</Text>
              <Text style={[
                styles.lastPredProbValue,
                { color: user.last_prediction.prediction === 1 ? '#E74C3C' : '#2ECC71' }
              ]}>
                {user.last_prediction.probability}%
              </Text>
            </View>

            <View style={styles.lastPredData}>
              <View style={styles.lastPredDataItem}>
                <Ionicons name="water" size={16} color="#E74C3C" />
                <Text style={styles.lastPredDataLabel}>Glukosa</Text>
                <Text style={styles.lastPredDataValue}>{user.last_prediction.glucose}</Text>
              </View>
              <View style={styles.lastPredDataItem}>
                <Ionicons name="fitness" size={16} color="#95E1D3" />
                <Text style={styles.lastPredDataLabel}>BMI</Text>
                <Text style={styles.lastPredDataValue}>{user.last_prediction.bmi}</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Global Stats */}
      <View style={styles.sectionHeader}>
        <Ionicons name="globe" size={20} color="#4ECDC4" />
        <Text style={styles.sectionTitle}>Statistik Global</Text>
      </View>

      <View style={styles.globalCard}>
        <View style={styles.globalRow}>
          <View style={styles.globalItem}>
            <Ionicons name="people" size={20} color="#3498DB" />
            <Text style={styles.globalValue}>{global_stats.total_users}</Text>
            <Text style={styles.globalLabel}>Total Users</Text>
          </View>

          <View style={styles.globalDivider} />

          <View style={styles.globalItem}>
            <Ionicons name="analytics" size={20} color="#9B59B6" />
            <Text style={styles.globalValue}>{global_stats.total_predictions}</Text>
            <Text style={styles.globalLabel}>Total Prediksi</Text>
          </View>
        </View>

        <View style={styles.globalRow}>
          <View style={styles.globalItem}>
            <Ionicons name="warning" size={20} color="#E74C3C" />
            <Text style={styles.globalValue}>
              {global_stats.global_diabetes_rate ? `${global_stats.global_diabetes_rate}%` : '-'}
            </Text>
            <Text style={styles.globalLabel}>Tingkat Diabetes</Text>
          </View>

          <View style={styles.globalDivider} />

          <View style={styles.globalItem}>
            <Ionicons name="speedometer" size={20} color="#F39C12" />
            <Text style={styles.globalValue}>
              {global_stats.avg_probability ? `${global_stats.avg_probability.toFixed(1)}%` : '-'}
            </Text>
            <Text style={styles.globalLabel}>Rata-rata Prob.</Text>
          </View>
        </View>
      </View>

      {/* Recent User Predictions */}
      {recent_user_predictions.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color="#4ECDC4" />
            <Text style={styles.sectionTitle}>Riwayat Terbaru Anda</Text>
          </View>

          {recent_user_predictions.map((pred) => (
            <View key={pred.id} style={styles.recentCard}>
              <View style={styles.recentHeader}>
                <View style={[
                  styles.recentBadge,
                  pred.prediction === 1 ? styles.recentBadgeDanger : styles.recentBadgeSuccess
                ]}>
                  <Ionicons
                    name={pred.prediction === 1 ? "close-circle" : "checkmark-circle"}
                    size={14}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={styles.recentProb}>
                  {pred.probability}%
                </Text>
              </View>
              <Text style={styles.recentDate}>{formatDate(pred.createdAt)}</Text>
            </View>
          ))}
        </>
      )}

      {/* Recent Global Predictions */}
      {recent_global_predictions.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons name="earth" size={20} color="#4ECDC4" />
            <Text style={styles.sectionTitle}>Aktivitas Global Terbaru</Text>
          </View>

          {recent_global_predictions.map((pred) => (
            <View key={pred.id} style={styles.globalRecentCard}>
              <View style={styles.globalRecentLeft}>
                <View style={styles.globalRecentAvatar}>
                  <Ionicons name="person" size={20} color="#4ECDC4" />
                </View>
                <View style={styles.globalRecentInfo}>
                  <Text style={styles.globalRecentName}>{pred.user_name || 'Anonymous'}</Text>
                  <Text style={styles.globalRecentDate}>{formatDate(pred.createdAt)}</Text>
                </View>
              </View>
              <View style={[
                styles.globalRecentBadge,
                pred.prediction === 1 ? styles.globalRecentBadgeDanger : styles.globalRecentBadgeSuccess
              ]}>
                <Text style={styles.globalRecentBadgeText}>{pred.probability}%</Text>
              </View>
            </View>
          ))}
        </>
      )}

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
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  welcomeIcon: {
    marginLeft: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2C3E50",
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5F5",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "600",
  },
  lastPredictionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lastPredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lastPredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  lastPredBadgeSuccess: {
    backgroundColor: "#2ECC71",
  },
  lastPredBadgeDanger: {
    backgroundColor: "#E74C3C",
  },
  lastPredBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  lastPredDate: {
    fontSize: 11,
    color: "#95A5A6",
    fontWeight: "600",
  },
  lastPredProb: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5F5",
    marginBottom: 16,
  },
  lastPredProbLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 6,
  },
  lastPredProbValue: {
    fontSize: 36,
    fontWeight: "800",
  },
  lastPredData: {
    flexDirection: 'row',
    gap: 12,
  },
  lastPredDataItem: {
    flex: 1,
    backgroundColor: "#F0F9FF",
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  lastPredDataLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 4,
  },
  lastPredDataValue: {
    fontSize: 18,
    color: "#2C3E50",
    fontWeight: "800",
  },
  globalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  globalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  globalItem: {
    flex: 1,
    alignItems: 'center',
  },
  globalValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    marginTop: 8,
    marginBottom: 4,
  },
  globalLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    fontWeight: "600",
    textAlign: 'center',
  },
  globalDivider: {
    width: 1,
    height: 60,
    backgroundColor: "#E8F5F5",
    marginHorizontal: 12,
  },
  recentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  recentBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentBadgeSuccess: {
    backgroundColor: "#2ECC71",
  },
  recentBadgeDanger: {
    backgroundColor: "#E74C3C",
  },
  recentProb: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2C3E50",
  },
  recentDate: {
    fontSize: 11,
    color: "#95A5A6",
    fontWeight: "500",
  },
  globalRecentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  globalRecentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  globalRecentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5F5",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  globalRecentInfo: {
    flex: 1,
  },
  globalRecentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 2,
  },
  globalRecentDate: {
    fontSize: 11,
    color: "#95A5A6",
    fontWeight: "500",
  },
  globalRecentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  globalRecentBadgeSuccess: {
    backgroundColor: "#E8F8F5",
  },
  globalRecentBadgeDanger: {
    backgroundColor: "#FFEBEE",
  },
  globalRecentBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2C3E50",
  },
});