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

export default function LoginScreen({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Gagal", data.detail || "Terjadi kesalahan");
        return;
      }

      const token = data.access_token;
      Alert.alert("Berhasil", "Login berhasil!");
      onLogin && onLogin(token);
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
              <Ionicons name="water" size={40} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.title}>Prediksi Pra-Diabetes</Text>
          <Text style={styles.subtitle}>
            Deteksi dini risiko pra-diabetes dengan AI
          </Text>
          
          {/* Feature Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="water" size={16} color="#E74C3C" />
              <Text style={styles.statText}>Gula Darah</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="fitness" size={16} color="#2ECC71" />
              <Text style={styles.statText}>BMI</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="analytics" size={16} color="#3498DB" />
              <Text style={styles.statText}>AI Prediksi</Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="mail" size={14} color={colors.primary} /> Email
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
                placeholder="contoh@email.com"
                placeholderTextColor="#B8B8B8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="lock-closed" size={14} color={colors.primary} /> Password
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
                placeholder="Masukkan password Anda"
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

          <TouchableOpacity onPress={() => onNavigate && onNavigate("forgot")}>
            <Text style={styles.forgotText}>
              <Ionicons name="help-circle" size={14} /> Lupa Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.loginButtonText}>Mulai Prediksi</Text>
              <Ionicons name="arrow-forward-circle" size={22} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Prediction Info Card */}
          <View style={styles.reminderCard}>
            <Ionicons name="information-circle" size={22} color="#3498DB" />
            <Text style={styles.reminderText}>
              Sistem AI kami dapat memprediksi risiko pra-diabetes berdasarkan data kesehatan Anda dengan tingkat akurasi tinggi
            </Text>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Pengguna baru? </Text>
            <TouchableOpacity
              onPress={() => onNavigate && onNavigate("register")}
            >
              <Text style={styles.registerLink}>
                Daftar & Mulai Prediksi <Ionicons name="rocket" size={14} />
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
  },
  form: {
    width: "100%",
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
  forgotText: {
    color: "#4ECDC4",
    textAlign: "right",
    marginBottom: 24,
    fontWeight: "700",
    fontSize: 13,
  },
  loginButton: {
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
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5F5",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
  },
  reminderText: {
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  registerLink: {
    fontSize: 14,
    color: "#4ECDC4",
    fontWeight: "800",
  },
});