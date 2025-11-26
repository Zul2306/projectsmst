// app/screens/PredictionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from '../utils/colors';
import API_URL from "../utils/api";

export default function PredictionScreen() {
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    bmi: '',
    dpf: '',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [result, setResult] = useState(null);
  const [token, setToken] = useState(null);

  // -------------------------------
  // LOAD TOKEN
  // -------------------------------
  useEffect(() => {
    const loadToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    loadToken();
  }, []);

  // ---------------------------------------
  // LOAD PREDIKSI TERAKHIR SECARA OTOMATIS
  // ---------------------------------------
  useEffect(() => {
    if (!token) return;

    const loadLatest = async () => {
      try {
        const res = await fetch(`${API_URL}/predict/latest`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setInitialLoad(false);
          return;
        }

        if (res.ok) {
          const data = await res.json();

          // Isi form otomatis
          setFormData({
            pregnancies: String(data.pregnancies ?? ''),
            glucose: String(data.glucose ?? ''),
            bloodPressure: String(data.blood_pressure ?? ''),
            bmi: String(data.bmi ?? ''),
            dpf: String(data.dpf ?? ''),
          });

          setResult({
            prediction:
              data.prediction === 1 || data.prediction === "Diabetes"
                ? "Diabetes"
                : "Tidak Diabetes",
            probability: `${data.probability}%`,
          });
        }
      } catch (e) {
        console.log("Load latest failed:", e);
      }

      setInitialLoad(false);
    };

    loadLatest();
  }, [token]);

  // -----------------------
  // HANDLE SUBMIT PREDIKSI
  // -----------------------
  const handleSubmit = async () => {
    if (!formData.pregnancies || !formData.glucose || !formData.bloodPressure || !formData.bmi || !formData.dpf) {
      Alert.alert("Error", "Mohon lengkapi semua data!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        pregnancies: parseFloat(formData.pregnancies),
        glucose: parseFloat(formData.glucose),
        bloodPressure: parseFloat(formData.bloodPressure),
        bmi: parseFloat(formData.bmi),
        dpf: parseFloat(formData.dpf),
      };

      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        Alert.alert("Error", "Gagal melakukan prediksi");
        setLoading(false);
        return;
      }

      const data = await res.json();

      setResult({
        prediction:
          data.prediction === 1 || data.prediction === "Diabetes"
            ? "Diabetes"
            : "Tidak Diabetes",
        probability: `${data.probability}%`,
      });

    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan koneksi");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      pregnancies: '',
      glucose: '',
      bloodPressure: '',
      bmi: '',
      dpf: '',
    });
    setResult(null);
  };

  if (initialLoad) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // -------------------------------------------------------
  // UI (tidak berubah kecuali logika di atas)
  // -------------------------------------------------------

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="pulse" size={32} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Prediksi Diabetes</Text>
        <Text style={styles.headerSubtitle}>
          Sistem akan memuat data prediksi terakhir Anda secara otomatis
        </Text>
      </View>

      {/* FORM */}
      <View style={styles.formCard}>
        {/** PREGNANCIES */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Jumlah Kehamilan</Text>
          <TextInput
            style={styles.input}
            value={formData.pregnancies}
            onChangeText={(text) => setFormData({ ...formData, pregnancies: text })}
            keyboardType="number-pad"
          />
        </View>

        {/** GLUCOSE */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kadar Glukosa</Text>
          <TextInput
            style={styles.input}
            value={formData.glucose}
            onChangeText={(text) => setFormData({ ...formData, glucose: text })}
            keyboardType="number-pad"
          />
        </View>

        {/** BLOOD PRESSURE */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tekanan Darah</Text>
          <TextInput
            style={styles.input}
            value={formData.bloodPressure}
            onChangeText={(text) => setFormData({ ...formData, bloodPressure: text })}
            keyboardType="number-pad"
          />
        </View>

        {/** BMI */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>BMI</Text>
          <TextInput
            style={styles.input}
            value={formData.bmi}
            onChangeText={(text) => {const fixed = text.replace(/,/g, '.'); setFormData({ ...formData, bmi: fixed })}}
            keyboardType="decimal-pad"
          />
        </View>

        {/** DPF */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Diabetes Pedigree Function</Text>
          <TextInput
            style={styles.input}
            value={formData.dpf}
            onChangeText={(text) => {const fixed = text.replace(/,/g, '.'); setFormData({ ...formData, dpf: fixed })}}
            keyboardType="decimal-pad"
          />
        </View>

        {/* BUTTONS */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Prediksi Sekarang</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RESULT */}
      {result && (
        <View style={[styles.resultCard, result.prediction === 'Tidak Diabetes' ? styles.resultCardSuccess : styles.resultCardDanger]}>
          <Text style={styles.resultTitle}>Hasil Prediksi</Text>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>{result.prediction}</Text>
          </View>

          <Text style={styles.probabilityLabel}>Probabilitas</Text>
          <View style={styles.probabilityBox}>
            <Text style={styles.probabilityText}>{result.probability}</Text>
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 16 },
  headerCard: {
    backgroundColor: colors.card, padding: 24, borderRadius: 16,
    alignItems: "center", marginBottom: 16
  },
  iconContainer: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    justifyContent: "center", alignItems: "center", marginBottom: 10
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.primary },
  headerSubtitle: { fontSize: 14, color: colors.textLight, textAlign: "center", marginTop: 8 },

  formCard: { backgroundColor: colors.card, padding: 20, borderRadius: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontWeight: "600", marginBottom: 6, color: colors.text },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    padding: 12, backgroundColor: colors.background, color: colors.text
  },

  actionButtons: { marginTop: 10, gap: 12 },
  submitButton: {
    backgroundColor: colors.primary, padding: 15, borderRadius: 12, alignItems: "center"
  },
  submitButtonText: { color: "#fff", fontWeight: "700" },
  resetButton: {
    padding: 15, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, alignItems: "center"
  },
  resetButtonText: { color: colors.text },

  resultCard: { marginTop: 20, padding: 20, borderRadius: 16 },
  resultCardSuccess: { backgroundColor: "#4CAF50" },
  resultCardDanger: { backgroundColor: "#F44336" },

  resultTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  resultBox: {
    padding: 16, backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12, marginBottom: 12
  },
  resultLabel: { fontSize: 22, fontWeight: "700", color: "#fff" },
  probabilityLabel: { color: "#fff", marginBottom: 6 },
  probabilityBox: { backgroundColor: "#fff", padding: 12, borderRadius: 12 },
  probabilityText: { color: colors.primary, fontSize: 24, fontWeight: "700" },
});
