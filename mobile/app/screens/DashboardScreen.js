import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import colors from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../utils/api';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [allChartData, setAllChartData] = useState({});
  const [selectedParam, setSelectedParam] = useState('glucose');

  // Tooltip states
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const [tooltipData, setTooltipData] = useState(null);
  const [chartLayout, setChartLayout] = useState(null);

  const parameters = [
    { label: 'Jumlah Kehamilan', value: 'pregnancies', color: '#9B59B6', icon: 'people' },
    { label: 'Kadar Glukosa', value: 'glucose', color: '#E74C3C', icon: 'water' },
    { label: 'Tekanan Darah', value: 'blood_pressure', color: '#3498DB', icon: 'heart' },
    { label: 'BMI', value: 'bmi', color: '#2ECC71', icon: 'fitness' },
    { label: 'DPF', value: 'dpf', color: '#F39C12', icon: 'pulse' },
    { label: 'Hasil Prediksi', value: 'prediction', color: '#E67E22', icon: 'analytics' },
  ];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setDashboard(null);
        setLoading(false);
        return;
      }

      // Load data untuk semua parameter sekaligus
      const chartDataPromises = parameters.map(param =>
        fetch(`${API_URL}/dashboard/?chart_param=${param.value}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            if (res.ok) return res.json();
            return null;
          })
          .then(data => ({ param: param.value, data: data?.chart_data || [] }))
          .catch(() => ({ param: param.value, data: [] }))
      );

      const chartResults = await Promise.all(chartDataPromises);
      const chartDataMap = {};
      chartResults.forEach(result => {
        chartDataMap[result.param] = result.data;
      });
      setAllChartData(chartDataMap);

      // Load dashboard info (user stats, dll) - hanya sekali
      const res = await fetch(
        `${API_URL}/dashboard/?chart_param=${selectedParam}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 401) {
        await AsyncStorage.removeItem('token');
        Alert.alert('Sesi berakhir', 'Silakan login kembali.');
        setDashboard(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.log('Dashboard load failed:', res.status, text);
        Alert.alert('Error', 'Gagal memuat dashboard dari server.');
        setDashboard(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setDashboard(data);
    } catch (err) {
      console.log('Error fetching dashboard:', err);
      Alert.alert('Error', 'Tidak dapat terhubung ke server.');
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleDateString('id-ID', options);
    } catch (e) {
      return '-';
    }
  };

  const getSelectedParamInfo = () => {
    return parameters.find(p => p.value === selectedParam) || parameters[1];
  };

  // Map chart point index ke full prediction object:
  // recent_user_predictions dari backend adalah urut terbaru->lama (desc). Pada chart, backend membalik jadi lama->baru.
  const getChartPredictionsInOrder = () => {
    if (!dashboard || !dashboard.recent_user_predictions) return [];
    // ambil 5 terakhir (server sudah memberi max 5), lalu reverse agar urut lama->baru (sama seperti chart)
    return [...dashboard.recent_user_predictions].slice(0, 5).reverse();
  };

  const handleDataPointClick = (data) => {
    // data biasanya berisi { value, dataset, getColor, index, x, y }
    const { x, y, index } = data;

    const chartPreds = getChartPredictionsInOrder();
    const pred = chartPreds[index] || null;

    // position x,y relatif ke chart container; kita akan simpan dan render tooltip di posisi ini
    if (chartLayout) {
      // Tooltip akan digambar pada posisi relatif container chartCard
      setTooltipX(x);
      setTooltipY(y);
      setTooltipData(pred ? pred : { date: (allChartData[selectedParam] && allChartData[selectedParam][index]) || null, value: data.value });
      setTooltipVisible(true);
    } else {
      // fallback: tampilkan data tanpa posisi
      setTooltipData(pred ? pred : { value: data.value });
      setTooltipX(20);
      setTooltipY(20);
      setTooltipVisible(true);
    }
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  const renderTooltip = () => {
    if (!tooltipVisible || !tooltipData || !chartLayout) return null;

    // tooltip size dan offset
    const tooltipWidth = 200;
    const tooltipHeight = 120;
    const offsetY = 12; // jarak antara dot dan tooltip

    // posX & posY berdasarkan koordinat titik (x,y) yang diberikan chart
    let left = tooltipX - tooltipWidth / 2;
    let top = tooltipY - tooltipHeight - offsetY;

    // pastikan tooltip tidak keluar dari sisi container
    if (left < 8) left = 8;
    if (left + tooltipWidth > chartLayout.width - 8) left = chartLayout.width - tooltipWidth - 8;
    if (top < 8) {
      // kalau di atas tidak muat, tampilkan di bawah titik
      top = tooltipY + offsetY;
      // jika bawah juga melebihi, clamp
      if (top + tooltipHeight > chartLayout.height - 8) {
        top = Math.max(8, chartLayout.height - tooltipHeight - 8);
      }
    }

    // jika tooltipData adalah object prediksi, tampilkan fieldnya
    const p = tooltipData;

    return (
      <View style={[styles.tooltipContainer, { left, top, width: tooltipWidth, height: tooltipHeight }]}>
        <View style={styles.tooltipHeader}>
          <Text style={styles.tooltipTitle}>
            {p && p.prediction !== undefined
              ? (p.prediction === 1 ? 'Diabetes (Prediksi)' : 'Tidak Diabetes (Prediksi)')
              : 'Data Titik'}
          </Text>
          <Text style={styles.tooltipDate}>
            {p && p.createdAt ? formatDate(p.createdAt) : (p && p.date ? p.date : '')}
          </Text>
        </View>

        <View style={styles.tooltipBody}>
          <View style={styles.tooltipRow}>
            <Text style={styles.tooltipLabel}>Glukosa:</Text>
            <Text style={styles.tooltipValue}>{p && p.glucose != null ? p.glucose : '-'}</Text>
          </View>
          <View style={styles.tooltipRow}>
            <Text style={styles.tooltipLabel}>BMI:</Text>
            <Text style={styles.tooltipValue}>{p && p.bmi != null ? p.bmi : '-'}</Text>
          </View>
          <View style={styles.tooltipRow}>
            <Text style={styles.tooltipLabel}>BP:</Text>
            <Text style={styles.tooltipValue}>{p && p.blood_pressure != null ? p.blood_pressure : '-'}</Text>
          </View>
          <View style={styles.tooltipRow}>
            <Text style={styles.tooltipLabel}>Prob.:</Text>
            <Text style={styles.tooltipValue}>{p && p.probability != null ? `${p.probability}%` : (p && p.value != null ? `${p.value}` : '-')}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderChart = () => {
    const currentChartData = allChartData[selectedParam] || [];
    
    if (currentChartData.length === 0) {
      return (
        <View style={styles.chartCard}>
          <View style={styles.noDataContainer}>
            <Ionicons name="bar-chart-outline" size={48} color="#B8B8B8" />
            <Text style={styles.noDataText}>Tidak ada data untuk ditampilkan</Text>
            <Text style={styles.noDataSubtext}>Lakukan prediksi untuk melihat grafik</Text>
          </View>
        </View>
      );
    }

    const paramInfo = getSelectedParamInfo();
    const chartData = {
      labels: currentChartData.map(d => d.date),
      datasets: [
        {
          data: currentChartData.map(d => d.value || 0),
          color: (opacity = 1) => paramInfo.color,
          strokeWidth: 3,
        },
      ],
    };

    // container untuk chart + tooltip. TouchableWithoutFeedback untuk menutup tooltip saat menekan area kosong.
    return (
      <TouchableWithoutFeedback onPress={hideTooltip}>
        <View
          style={styles.chartCard}
          onLayout={(e) => {
            const layout = e.nativeEvent.layout;
            // simpan layout relatif chartCard untuk menghitung posisi tooltip
            setChartLayout({ x: layout.x, y: layout.y, width: layout.width, height: layout.height });
          }}
        >
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: selectedParam === 'prediction' ? 0 : 1,
              color: (opacity = 1) => paramInfo.color,
              labelColor: (opacity = 1) => '#7F8C8D',
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: paramInfo.color,
                fill: '#ffffff',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#E8F5F5',
                strokeWidth: 1,
              },
            }}
            bezier
            style={styles.chart}
            withVerticalLines={false}
            withHorizontalLines={true}
            withInnerLines={true}
            withOuterLines={true}
            yAxisSuffix=""
            yAxisLabel=""
            onDataPointClick={(data) => {
              // react-native-chart-kit memberikan x,y relatif ke chart area
              handleDataPointClick(data);
            }}
          />

          <View style={styles.chartLegend}>
            <Ionicons name={paramInfo.icon} size={16} color={paramInfo.color} />
            <Text style={styles.chartLegendText}>Sumbu X: Tanggal Prediksi</Text>
            <Text style={styles.chartLegendSeparator}>•</Text>
            <Text style={styles.chartLegendText}>Sumbu Y: {paramInfo.label}</Text>
          </View>

          {/* Tooltip overlay */}
          {renderTooltip()}
        </View>
      </TouchableWithoutFeedback>
    );
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

  const { user = {}, recent_user_predictions = [] } = dashboard;

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
          <Text style={styles.statValue}>{user.total_predictions ?? 0}</Text>
          <Text style={styles.statLabel}>Total Prediksi</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
          </View>
          <Text style={styles.statValue}>{user.non_diabetes_count ?? 0}</Text>
          <Text style={styles.statLabel}>Negatif</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="warning" size={24} color="#E74C3C" />
          </View>
          <Text style={styles.statValue}>{user.diabetes_count ?? 0}</Text>
          <Text style={styles.statLabel}>Positif</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trending-up" size={24} color="#3498DB" />
          </View>
          <Text style={styles.statValue}>
            {user.avg_probability ? `${Number(user.avg_probability).toFixed(1)}%` : '-'}
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

      {/* Parameter Filter */}
      <View style={styles.sectionHeader}>
        <Ionicons name="options" size={20} color="#4ECDC4" />
        <Text style={styles.sectionTitle}>Filter Parameter Grafik</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paramFilter}>
        {parameters.map((param) => (
          <TouchableOpacity
            key={param.value}
            style={[
              styles.paramButton,
              selectedParam === param.value && { 
                backgroundColor: param.color,
                borderColor: param.color,
              },
            ]}
            onPress={() => setSelectedParam(param.value)}
          >
            <Ionicons 
              name={param.icon} 
              size={16} 
              color={selectedParam === param.value ? '#FFFFFF' : param.color} 
            />
            <Text
              style={[
                styles.paramButtonText,
                selectedParam === param.value && styles.paramButtonTextActive,
              ]}
            >
              {param.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chart */}
      <View style={styles.sectionHeader}>
        <Ionicons name="bar-chart" size={20} color="#4ECDC4" />
        <Text style={styles.sectionTitle}>Grafik {getSelectedParamInfo().label}</Text>
      </View>

      {renderChart()}

      {/* Recent User Predictions */}
      {recent_user_predictions.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color="#4ECDC4" />
            <Text style={styles.sectionTitle}>Riwayat Terbaru (5 Terakhir)</Text>
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
  paramFilter: {
    marginBottom: 24,
  },
  paramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E8F5F5",
  },
  paramButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7F8C8D",
  },
  paramButtonTextActive: {
    color: "#FFFFFF",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    // relative container sehingga tooltip absolute bekerja relatif ke sini
    position: 'relative',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8F5F5',
    gap: 8,
  },
  chartLegendText: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  chartLegendSeparator: {
    fontSize: 11,
    color: '#B8B8B8',
  },
  noDataContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
    marginTop: 12,
  },
  noDataSubtext: {
    fontSize: 12,
    color: '#95A5A6',
    fontWeight: '500',
    marginTop: 4,
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

  /* Tooltip styles */
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#EDF3F3',
  },
  tooltipHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 6,
    marginBottom: 6,
  },
  tooltipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2C3E50',
  },
  tooltipDate: {
    fontSize: 10,
    color: '#95A5A6',
    marginTop: 2,
  },
  tooltipBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tooltipLabel: {
    fontSize: 11,
    color: '#7F8C8D',
  },
  tooltipValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C3E50',
  },
});
