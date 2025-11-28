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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../utils/colors";
import API_URL from "../utils/api";

export default function RegisterScreen({ onNavigate, onLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    const emailNorm = email.toLowerCase().trim();

    // optional: enforce @gmail.com
    if (!emailNorm.endsWith("@gmail.com")) {
      Alert.alert("Error", "Email harus menggunakan domain @gmail.com");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak cocok");
      return;
    }

    // password strength
    if (!PASSWORD_REGEX.test(password)) {
      Alert.alert(
        "Error",
        "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan simbol"
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: emailNorm,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Register Gagal", data.detail || "Terjadi kesalahan");
        return;
      }

      Alert.alert("Sukses", "Akun berhasil dibuat!", [
        {
          text: "OK",
          onPress: () => {
            // otomatis arahkan ke login (jika ingin login langsung, Anda bisa mengirim token)
            onNavigate && onNavigate("login");
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Tidak dapat terhubung ke server");
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
              <Ionicons name="person-add" size={36} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>Daftar Sekarang</Text>
          <Text style={styles.subtitle}>
            Mulai perjalanan deteksi dini pra-diabetes Anda
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="person" size={14} color={colors.primary} /> Nama
              Lengkap
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-circle-outline"
                size={22}
                color="#4ECDC4"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#B8B8B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="mail" size={14} color={colors.primary} /> Email
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={22}
                color="#4ECDC4"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="contoh@gmail.com"
                placeholderTextColor="#B8B8B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="lock-closed" size={14} color={colors.primary} />{" "}
              Password
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
                placeholder="Minimal 8 karakter"
                placeholderTextColor="#B8B8B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
                placeholder="Ulangi password Anda"
                placeholderTextColor="#B8B8B8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={22}
                  color="#4ECDC4"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.registerButtonText}>Buat Akun</Text>
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={20} color="#2ECC71" />
            <Text style={styles.infoText}>
              Data Anda aman dan terenkripsi dengan teknologi terkini
            </Text>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => onNavigate && onNavigate("login")}>
              <Text style={styles.loginLink}>
                Masuk di sini <Ionicons name="log-in" size={14} />
              </Text>
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
    marginBottom: 16,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#7F8C8D",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 18,
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
  registerButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F8F5",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2ECC71",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#2C3E50",
    fontWeight: "600",
    lineHeight: 18,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  loginLink: {
    fontSize: 14,
    color: "#4ECDC4",
    fontWeight: "800",
  },
});
