import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import colors from '../utils/colors';

export default function ClassificationScreen() {
  const [formData, setFormData] = useState({
    gender: 'Perempuan',
    smokingHistory: 'Tidak Pernah',
    age: '',
    bmi: '',
    hbA1c: '',
    bloodGlucose: '',
    hypertension: 'Tidak',
    heartDisease: 'Tidak',
  });

  const handleSubmit = () => {
    // Validasi
    if (!formData.age || !formData.bmi || !formData.hbA1c || !formData.bloodGlucose) {
      Alert.alert('Error', 'Mohon lengkapi semua data!');
      return;
    }

    // Proses prediksi (simulasi)
    Alert.alert('Sukses', 'Data berhasil disubmit untuk prediksi!');
    console.log('Form Data:', formData);
  };

  const handleReset = () => {
    setFormData({
      gender: 'Perempuan',
      smokingHistory: 'Tidak Pernah',
      age: '',
      bmi: '',
      hbA1c: '',
      bloodGlucose: '',
      hypertension: 'Tidak',
      heartDisease: 'Tidak',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="heart" size={32} color={colors.danger} />
        </View>
        <Text style={styles.headerTitle}>Diabetes Predictor</Text>
        <Text style={styles.headerSubtitle}>
          Masukkan data kesehatan Anda untuk mendapatkan prediksi akurat
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        {/* Jenis Kelamin */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              style={styles.picker}
            >
              <Picker.Item label="Perempuan" value="Perempuan" />
              <Picker.Item label="Laki-laki" value="Laki-laki" />
            </Picker>
          </View>
        </View>

        {/* Riwayat Merokok */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Riwayat Merokok</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.smokingHistory}
              onValueChange={(value) => setFormData({ ...formData, smokingHistory: value })}
              style={styles.picker}
            >
              <Picker.Item label="Tidak Pernah" value="Tidak Pernah" />
              <Picker.Item label="Pernah" value="Pernah" />
              <Picker.Item label="Saat Ini" value="Saat Ini" />
              <Picker.Item label="Mantan" value="Mantan" />
            </Picker>
          </View>
        </View>

        {/* Usia */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Usia (tahun)</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="30"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
          />
        </View>

        {/* BMI */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>BMI (kg/m²)</Text>
          <TextInput
            style={styles.input}
            value={formData.bmi}
            onChangeText={(text) => setFormData({ ...formData, bmi: text })}
            placeholder="25"
            placeholderTextColor={colors.textLight}
            keyboardType="decimal-pad"
          />
        </View>

        {/* HbA1c Level */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>HbA1c Level (%)</Text>
          <TextInput
            style={styles.input}
            value={formData.hbA1c}
            onChangeText={(text) => setFormData({ ...formData, hbA1c: text })}
            placeholder="5"
            placeholderTextColor={colors.textLight}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Gula Darah */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Gula Darah (mg/dL)</Text>
          <TextInput
            style={styles.input}
            value={formData.bloodGlucose}
            onChangeText={(text) => setFormData({ ...formData, bloodGlucose: text })}
            placeholder="100"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
          />
        </View>

        {/* Hipertensi */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hipertensi</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                formData.hypertension === 'Tidak' && styles.optionButtonActive
              ]}
              onPress={() => setFormData({ ...formData, hypertension: 'Tidak' })}
            >
              <Text style={[
                styles.optionButtonText,
                formData.hypertension === 'Tidak' && styles.optionButtonTextActive
              ]}>
                Tidak
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                formData.hypertension === 'Ya' && styles.optionButtonActive
              ]}
              onPress={() => setFormData({ ...formData, hypertension: 'Ya' })}
            >
              <Text style={[
                styles.optionButtonText,
                formData.hypertension === 'Ya' && styles.optionButtonTextActive
              ]}>
                Ya
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Penyakit Jantung */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Penyakit Jantung</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                formData.heartDisease === 'Tidak' && styles.optionButtonActive
              ]}
              onPress={() => setFormData({ ...formData, heartDisease: 'Tidak' })}
            >
              <Text style={[
                styles.optionButtonText,
                formData.heartDisease === 'Tidak' && styles.optionButtonTextActive
              ]}>
                Tidak
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                formData.heartDisease === 'Ya' && styles.optionButtonActive
              ]}
              onPress={() => setFormData({ ...formData, heartDisease: 'Ya' })}
            >
              <Text style={[
                styles.optionButtonText,
                formData.heartDisease === 'Ya' && styles.optionButtonTextActive
              ]}>
                Ya
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh-outline" size={20} color={colors.text} />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Prediksi</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.danger}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  optionButtonTextActive: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  resetButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});