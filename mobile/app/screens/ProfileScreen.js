import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../utils/api";

export default function ProfileScreen({ onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    weight: "",
    height: "",
  });
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [token, setToken] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const t = await AsyncStorage.getItem("token");
        if (!t) {
          Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
          onLogout && onLogout();
          return;
        }
        setToken(t);
        await fetchProfile(t);
      } catch (err) {
        console.log("load profile err", err);
        Alert.alert("Error", "Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fetchProfile = async (t) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: t,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("fetchProfile err", data);
        Alert.alert("Error", data.detail || "Gagal memuat profil");
        if (res.status === 401) onLogout && onLogout();
        return;
      }
      setProfile({
        name: data.name || "",
        email: data.email || "",
        weight: data.weight ? String(data.weight) : "",
        height: data.height ? String(data.height) : "",
      });
      setEditedProfile({
        name: data.name || "",
        weight: data.weight ? String(data.weight) : "",
        height: data.height ? String(data.height) : "",
      });
    } catch (err) {
      console.log("fetchProfile exception", err);
      Alert.alert("Error", "Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
  };

  const handleSubmit = async () => {
    if (!editedProfile.name.trim()) {
      Alert.alert("Error", "Nama tidak boleh kosong");
      return;
    }
    const weightNum = parseFloat(editedProfile.weight);
    const heightNum = parseFloat(editedProfile.height);
    if (!weightNum || weightNum <= 0) {
      Alert.alert("Error", "Berat badan harus lebih dari 0");
      return;
    }
    if (!heightNum || heightNum <= 0) {
      Alert.alert("Error", "Tinggi badan harus lebih dari 0");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name: editedProfile.name,
          weight: weightNum,
          height: heightNum,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("update profile err", data);
        Alert.alert("Error", data.detail || "Gagal mengupdate profil");
        if (res.status === 401) onLogout && onLogout();
        return;
      }

      setProfile({
        name: data.name || editedProfile.name,
        email: data.email || profile.email,
        weight: data.weight ? String(data.weight) : String(weightNum),
        height: data.height ? String(data.height) : String(heightNum),
      });
      setIsEditing(false);
      Alert.alert("Sukses", "Profile berhasil diupdate!");
    } catch (err) {
      console.log("submit exception", err);
      Alert.alert("Error", "Tidak dapat terhubung ke server");
    } finally {
      setSaving(false);
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(profile.weight);
    const height = parseFloat(profile.height) / 100;
    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return "-";
  };

  const getBMICategory = (bmi) => {
    if (bmi === "-") return { text: "-", color: colors.textLight };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { text: "Underweight", color: colors.warning };
    if (bmiValue < 25) return { text: "Normal", color: colors.success };
    if (bmiValue < 30) return { text: "Overweight", color: colors.warning };
    return { text: "Obese", color: colors.danger };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header with Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={52} color="#FFFFFF" />
          </View>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
          </View>
        </View>
        <Text style={styles.headerName}>{profile.name}</Text>
        <Text style={styles.headerEmail}>{profile.email}</Text>
      </View>

      {/* BMI Card */}
      <View style={styles.bmiCard}>
        <View style={styles.bmiHeader}>
          <Ionicons name="fitness" size={24} color="#4ECDC4" />
          <Text style={styles.bmiLabel}>Body Mass Index (BMI)</Text>
        </View>
        <Text style={styles.bmiValue}>{bmi}</Text>
        <View style={[styles.bmiCategory, { backgroundColor: `${bmiCategory.color}15` }]}>
          <Text style={[styles.bmiCategoryText, { color: bmiCategory.color }]}>
            {bmiCategory.text}
          </Text>
        </View>
        {bmi !== "-" && (
          <Text style={styles.bmiHelper}>
            BMI dihitung dari berat dan tinggi badan Anda
          </Text>
        )}
      </View>

      {/* Profile Information Card */}
      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <View style={styles.formTitleContainer}>
            <Ionicons name="information-circle" size={22} color="#4ECDC4" />
            <Text style={styles.formTitle}>Informasi Profil</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="create" size={18} color="#4ECDC4" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="person" size={12} color="#4ECDC4" /> NAMA LENGKAP
          </Text>
          {isEditing ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#B8B8B8"
              />
            </View>
          ) : (
            <Text style={styles.value}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="mail" size={12} color="#4ECDC4" /> EMAIL
          </Text>
          <Text style={styles.value}>{profile.email}</Text>
          <Text style={styles.helperText}>Email tidak dapat diubah</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="scale" size={12} color="#4ECDC4" /> BERAT BADAN (KG)
          </Text>
          {isEditing ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={editedProfile.weight}
                onChangeText={(text) => {
                  const fixed = text.replace(/,/g, '.');
                  setEditedProfile({ ...editedProfile, weight: fixed });
                }}
                keyboardType="decimal-pad"
                placeholder="Contoh: 65.5"
                placeholderTextColor="#B8B8B8"
              />
            </View>
          ) : (
            <Text style={styles.value}>{profile.weight} kg</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Ionicons name="resize" size={12} color="#4ECDC4" /> TINGGI BADAN (CM)
          </Text>
          {isEditing ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={editedProfile.height}
                onChangeText={(text) => {
                  const fixed = text.replace(/,/g, '.');
                  setEditedProfile({ ...editedProfile, height: fixed });
                }}
                keyboardType="decimal-pad"
                placeholder="Contoh: 170"
                placeholderTextColor="#B8B8B8"
              />
            </View>
          ) : (
            <Text style={styles.value}>{profile.height} cm</Text>
          )}
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Ionicons name="close-circle" size={20} color="#7F8C8D" />
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Simpan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Logout Button */}
      {!isEditing && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out" size={22} color="#E74C3C" />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F9FF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statusBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  bmiCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bmiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  bmiLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "600",
  },
  bmiValue: {
    fontSize: 56,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 12,
  },
  bmiCategory: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  bmiCategoryText: {
    fontSize: 15,
    fontWeight: "700",
  },
  bmiHelper: {
    fontSize: 12,
    color: "#95A5A6",
    fontStyle: "italic",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  formTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#E8F5F5",
    borderRadius: 12,
  },
  editButtonText: {
    color: "#4ECDC4",
    fontWeight: "700",
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7F8C8D",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8F5F5",
  },
  input: {
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
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F0F9FF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#7F8C8D",
    fontWeight: "700",
    fontSize: 15,
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
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
    fontSize: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFEBEE",
    padding: 18,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#FFCDD2",
  },
  logoutText: {
    color: "#E74C3C",
    fontWeight: "700",
    fontSize: 16,
  },
});