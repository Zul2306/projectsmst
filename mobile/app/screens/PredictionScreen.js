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

  // LOAD TOKEN
  useEffect(() => {
    const loadToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    loadToken();
  }, []);

  // LOAD PREDIKSI TERAKHIR SECARA OTOMATIS
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

  // HANDLE SUBMIT PREDIKSI
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="analytics" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Prediksi Pra-Diabetes</Text>
        <Text style={styles.headerSubtitle}>
          Masukkan data kesehatan Anda untuk mendapatkan prediksi risiko pra-diabetes dengan AI
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={22} color="#3498DB" />
        <Text style={styles.infoText}>
          Data prediksi terakhir Anda akan dimuat secara otomatis jika tersedia
        </Text>
      </View>

      {/* FORM */}
      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <Ionicons name="clipboard" size={22} color="#4ECDC4" />
          <Text style={styles.formTitle}>Data Kesehatan</Text>
        </View>

        {/* PREGNANCIES */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="fitness" size={12} color="#4ECDC4" /> JUMLAH KEHAMILAN
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="people" size={20} color="#4ECDC4" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.pregnancies}
              onChangeText={(text) => setFormData({ ...formData, pregnancies: text })}
              keyboardType="number-pad"
              placeholder="Contoh: 2"
              placeholderTextColor="#B8B8B8"
            />
          </View>
        </View>

        {/* GLUCOSE */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="water" size={12} color="#4ECDC4" /> KADAR GLUKOSA (mg/dL)
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="water" size={20} color="#E74C3C" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.glucose}
              onChangeText={(text) => setFormData({ ...formData, glucose: text })}
              keyboardType="number-pad"
              placeholder="Contoh: 120"
              placeholderTextColor="#B8B8B8"
            />
          </View>
        </View>

        {/* BLOOD PRESSURE */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="heart" size={12} color="#4ECDC4" /> TEKANAN DARAH (mmHg)
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="heart-circle" size={20} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.bloodPressure}
              onChangeText={(text) => setFormData({ ...formData, bloodPressure: text })}
              keyboardType="number-pad"
              placeholder="Contoh: 80"
              placeholderTextColor="#B8B8B8"
            />
          </View>
        </View>

        {/* BMI */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="body" size={12} color="#4ECDC4" /> BODY MASS INDEX (BMI)
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="fitness" size={20} color="#95E1D3" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.bmi}
              onChangeText={(text) => {
                const fixed = text.replace(/,/g, '.');
                setFormData({ ...formData, bmi: fixed });
              }}
              keyboardType="decimal-pad"
              placeholder="Contoh: 25.3"
              placeholderTextColor="#B8B8B8"
            />
          </View>
        </View>

        {/* DPF */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="git-network" size={12} color="#4ECDC4" /> DIABETES PEDIGREE FUNCTION
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="git-network" size={20} color="#9B59B6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.dpf}
              onChangeText={(text) => {
                const fixed = text.replace(/,/g, '.');
                setFormData({ ...formData, dpf: fixed });
              }}
              keyboardType="decimal-pad"
              placeholder="Contoh: 0.5"
              placeholderTextColor="#B8B8B8"
            />
          </View>
          <Text style={styles.helperText}>Fungsi keturunan diabetes (0.0 - 2.5)</Text>
        </View>

        {/* BUTTONS */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit} 
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="analytics" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Mulai Prediksi</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh" size={20} color="#7F8C8D" />
            <Text style={styles.resetButtonText}>Reset Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RESULT */}
      {result && (
        <View style={[
          styles.resultCard,
          result.prediction === 'Tidak Diabetes' ? styles.resultCardSuccess : styles.resultCardDanger
        ]}>
          <View style={styles.resultHeader}>
            <Ionicons 
              name={result.prediction === 'Tidak Diabetes' ? "checkmark-circle" : "warning"} 
              size={32} 
              color="#FFFFFF" 
            />
            <Text style={styles.resultTitle}>Hasil Prediksi</Text>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>{result.prediction}</Text>
            <Text style={styles.resultDescription}>
              {result.prediction === 'Tidak Diabetes' 
                ? 'Risiko pra-diabetes Anda rendah' 
                : 'Risiko pra-diabetes terdeteksi'}
            </Text>
          </View>

          <View style={styles.probabilityContainer}>
            <Text style={styles.probabilityLabel}>Tingkat Kepercayaan AI</Text>
            <View style={styles.probabilityBox}>
              <Text style={styles.probabilityText}>{result.probability}</Text>
            </View>
          </View>

          {result.prediction === 'Diabetes' && (
            <View style={styles.recommendationBox}>
              <Ionicons name="medical" size={18} color="#FFFFFF" />
              <Text style={styles.recommendationText}>
                Konsultasikan dengan dokter untuk pemeriksaan lebih lanjut
              </Text>
            </View>
          )}
        </View>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#2C3E50",
    fontWeight: "600",
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7F8C8D",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8F5F5",
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
  },
  helperText: {
    fontSize: 11,
    color: "#95A5A6",
    marginTop: 6,
    fontStyle: "italic",
  },
  actionButtons: {
    marginTop: 12,
    gap: 12,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4ECDC4",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    backgroundColor: "#F0F9FF",
  },
  resetButtonText: {
    color: "#7F8C8D",
    fontWeight: "700",
    fontSize: 16,
  },
  resultCard: {
    marginTop: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  resultCardSuccess: {
    backgroundColor: "#2ECC71",
  },
  resultCardDanger: {
    backgroundColor: "#E74C3C",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  resultTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  resultBox: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    marginBottom: 16,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  resultDescription: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  probabilityContainer: {
    marginBottom: 16,
  },
  probabilityLabel: {
    color: "#FFFFFF",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  probabilityBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  probabilityText: {
    color: "#4ECDC4",
    fontSize: 32,
    fontWeight: "800",
  },
  recommendationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 14,
    borderRadius: 12,
  },
  recommendationText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
});