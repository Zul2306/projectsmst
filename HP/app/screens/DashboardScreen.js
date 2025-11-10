import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import colors from '../utils/colors';

export default function DashboardScreen() {
  const screenWidth = Dimensions.get('window').width;

  const bloodSugarData = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [{
      data: [120, 115, 125, 118, 122, 119, 117],
      color: (opacity = 1) => colors.chartBlue,
      strokeWidth: 3
    }]
  };

  const activityData = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [{
      data: [30, 32, 42, 36, 43, 49, 55],
      color: (opacity = 1) => colors.chartBlue,
      strokeWidth: 3
    }]
  };

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.chartBlue,
    labelColor: (opacity = 1) => colors.textLight,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.card
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.border,
      strokeWidth: 1
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ringkasan Kesehatan Anda</Text>
        <View style={styles.cardGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>130</Text>
            <Text style={styles.statLabel}>Gula</Text>
            <Text style={styles.statUnit}>darah</Text>
            <Text style={styles.statUnit}>mg/dL</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24.8</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Min/hari</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>500</Text>
            <Text style={styles.statLabel}>Kalori</Text>
          </View>
        </View>

        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>Status: Sehat</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Tracking</Text>
        
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Gula Darah</Text>
          <LineChart
            data={bloodSugarData}
            width={screenWidth - 68}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            fromZero={false}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Aktivitas</Text>
          <LineChart
            data={activityData}
            width={screenWidth - 68}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            fromZero={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  statUnit: {
    fontSize: 12,
    color: colors.textLight,
  },
  statusBanner: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
});