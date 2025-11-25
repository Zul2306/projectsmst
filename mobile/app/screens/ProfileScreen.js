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
    // Validasi input (sama seperti UI)
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

      // Update local state dari response
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
    const height = parseFloat(profile.height) / 100; // convert cm to m
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={48} color={colors.primary} />
        </View>
        <Text style={styles.headerName}>{profile.name}</Text>
        <Text style={styles.headerEmail}>{profile.email}</Text>
      </View>

      {/* BMI */}
      <View style={styles.bmiCard}>
        <Text style={styles.bmiLabel}>Body Mass Index (BMI)</Text>
        <Text style={styles.bmiValue}>{bmi}</Text>
        <View style={[styles.bmiCategory, { backgroundColor: `${bmiCategory.color}15` }]}>
          <Text style={[styles.bmiCategoryText, { color: bmiCategory.color }]}>{bmiCategory.text}</Text>
        </View>
      </View>

      {/* Form */}
      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Informasi Profile</Text>
          {!isEditing && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="create-outline" size={20} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
            />
          ) : (
            <Text style={styles.value}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Berat Badan (kg)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedProfile.weight}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, weight: text })}
              keyboardType="decimal-pad"
            />
          ) : (
            <Text style={styles.value}>{profile.weight} kg</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tinggi Badan (cm)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedProfile.height}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, height: text })}
              keyboardType="decimal-pad"
            />
          ) : (
            <Text style={styles.value}>{profile.height} cm</Text>
          )}
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Simpan</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!isEditing && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Styles = gunakan styles yang sama seperti file kamu saat ini
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 16 },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}25`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerName: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: 4 },
  headerEmail: { fontSize: 14, color: colors.textLight },
  bmiCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 16 },
  bmiLabel: { fontSize: 14, color: colors.textLight, marginBottom: 8 },
  bmiValue: { fontSize: 48, fontWeight: "700", color: colors.text, marginBottom: 12 },
  bmiCategory: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  bmiCategoryText: { fontSize: 14, fontWeight: "600" },
  formCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16 },
  formHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  editButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, backgroundColor: `${colors.primary}15`, borderRadius: 8 },
  editButtonText: { color: colors.primary, fontWeight: "600", marginLeft: 4, fontSize: 14 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: colors.textLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  value: { fontSize: 16, color: colors.text, fontWeight: "500" },
  input: { backgroundColor: colors.background, borderRadius: 10, padding: 12, fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.border },
  helperText: { fontSize: 12, color: colors.textLight, marginTop: 4, fontStyle: "italic" },
  actionButtons: { flexDirection: "row", marginTop: 8, gap: 12 },
  cancelButton: { flex: 1, backgroundColor: colors.background, padding: 14, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  cancelButtonText: { color: colors.text, fontWeight: "600", fontSize: 15 },
  submitButton: { flex: 1, backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: "center" },
  submitButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: `${colors.danger}15`, padding: 16, borderRadius: 12, marginTop: 8 },
  logoutText: { color: colors.danger, fontWeight: "600", fontSize: 16, marginLeft: 8 },
});
