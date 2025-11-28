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

export default function ResetPasswordScreen({ route, onNavigate }) {
  const { email } = route.params;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleSubmit = async () => {
    if (!password.trim() || !confirm.trim()) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Password tidak cocok");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      Alert.alert(
        "Error",
        "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan simbol"
      );
      return;
    }

    setLoading(true);
    try {
      const emailNorm = (email || "").toLowerCase().trim(); // email from route.params
      // optional: enforce @gmail.com
      if (!emailNorm.endsWith("@gmail.com")) {
        Alert.alert("Error", "Email harus menggunakan domain @gmail.com");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNorm, password }),
      });

      if (res.ok) {
        Alert.alert("Berhasil", "Password berhasil direset", [
          { text: "OK", onPress: () => onNavigate("login") },
        ]);
      } else {
        const err = await res.json().catch(() => ({}));
        Alert.alert("Error", err.detail || "Gagal reset password");
      }
    } catch (error) {
      console.log(error);
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
              <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Buat password baru yang kuat dan mudah diingat untuk akun Anda
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="lock-closed" size={14} color={colors.primary} />{" "}
              Password Baru
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
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#B8B8B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={22}
                  color="#4ECDC4"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.primary}
              />{" "}
              Konfirmasi Password
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="shield-outline"
                size={22}
                color="#4ECDC4"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Ulangi password baru"
                placeholderTextColor="#B8B8B8"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showConfirm}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirm ? "eye" : "eye-off"}
                  size={22}
                  color="#4ECDC4"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Requirements Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#3498DB" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Syarat Password:</Text>
              <Text style={styles.infoText}>• Minimal 6 karakter</Text>
              <Text style={styles.infoText}>
                • Kombinasi huruf dan angka lebih aman
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.submitButtonText}>Reset Password</Text>
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.backContainer}>
            <TouchableOpacity
              onPress={() => onNavigate && onNavigate("login")}
              disabled={loading}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back-circle" size={20} color="#4ECDC4" />
              <Text style={styles.backLink}>Kembali ke Halaman Login</Text>
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
    paddingHorizontal: 16,
    lineHeight: 22,
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
    fontSize: 15,
    color: "#2C3E50",
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 4,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E8F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    color: "#2C3E50",
    fontWeight: "700",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#2C3E50",
    fontWeight: "500",
    lineHeight: 18,
  },
  submitButton: {
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
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
