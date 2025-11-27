import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../utils/colors";
import API_URL from "../utils/api";

export default function VerifyOTPScreen({ route, onNavigate }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Masukkan kode OTP");
      return;
    }

    if (otp.length !== 6) {
      Alert.alert("Error", "Kode OTP harus 6 digit");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        Alert.alert("Error", "OTP salah atau expired");
        return;
      }

      onNavigate("reset", { email });
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        Alert.alert("Berhasil", "Kode OTP baru telah dikirim");
      } else {
        Alert.alert("Error", "Gagal mengirim ulang kode");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative Background Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="mail-open" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#2ECC71" />
            </View>
          </View>
          
          <Text style={styles.title}>Verifikasi OTP</Text>
          <Text style={styles.subtitle}>
            Masukkan kode 6 digit yang telah dikirim ke
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="keypad" size={14} color={colors.primary} /> Kode OTP
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#4ECDC4"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor="#B8B8B8"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
                editable={!loading}
              />
            </View>
          </View>

          {/* Timer Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color="#F39C12" />
            <Text style={styles.infoText}>
              Kode OTP berlaku selama 5 menit. Pastikan memasukkan kode dengan benar.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]} 
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.verifyButtonText}>Verifikasi Sekarang</Text>
                <Ionicons name="checkmark-done-circle" size={22} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Tidak menerima kode? </Text>
            <TouchableOpacity 
              onPress={handleResend}
              disabled={loading}
            >
              <Text style={styles.resendLink}>
                <Ionicons name="refresh-circle" size={14} /> Kirim Ulang
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.backContainer}>
            <TouchableOpacity 
              onPress={() => onNavigate && onNavigate('forgot')}
              disabled={loading}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back-circle" size={20} color="#4ECDC4" />
              <Text style={styles.backLink}>Ubah Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  decorativeCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#4ECDC4",
    opacity: 0.1,
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#95E1D3",
    opacity: 0.1,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  iconBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  securityBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4ECDC4",
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E8F5F5",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 54,
    fontSize: 20,
    color: "#2C3E50",
    fontWeight: "700",
    letterSpacing: 12,
    textAlign: "center",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F39C12",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#2C3E50",
    fontWeight: "600",
    lineHeight: 18,
  },
  verifyButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  verifyButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  resendContainer: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resendText: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  resendLink: {
    fontSize: 14,
    color: "#4ECDC4",
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: "#95A5A6",
    fontWeight: "600",
  },
  backContainer: {
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backLink: {
    color: "#4ECDC4",
    fontWeight: "700",
    fontSize: 14,
  },
});