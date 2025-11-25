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

const API_URL = "http://192.168.0.107:8000"; // Ganti dengan URL API Anda

export default function ResetPasswordScreen({ route, onNavigate }) {
	const { email } = route.params;
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!password.trim() || !confirm.trim()) {
			Alert.alert("Error", "Semua field harus diisi");
			return;
		}

		if (password.length < 6) {
			Alert.alert("Error", "Password minimal 6 karakter");
			return;
		}

		if (password !== confirm) {
			Alert.alert("Error", "Password tidak cocok");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/auth/reset-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (res.ok) {
				Alert.alert("Berhasil", "Password berhasil direset", [
					{ text: "OK", onPress: () => onNavigate("login") }
				]);
			} else {
				Alert.alert("Error", "Gagal reset password");
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
				<View style={styles.header}>
					<View style={styles.iconContainer}>
						<Ionicons name="lock-closed-outline" size={48} color={colors.primary} />
					</View>
					<Text style={styles.title}>Reset Password</Text>
					<Text style={styles.subtitle}>
						Buat password baru untuk akun Anda
					</Text>
				</View>

				<View style={styles.form}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Password Baru</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="lock-closed-outline"
								size={20}
								color={colors.textLight}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Masukkan password baru"
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
									name={showPassword ? "eye-outline" : "eye-off-outline"}
									size={20}
									color={colors.textLight}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Konfirmasi Password</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="lock-closed-outline"
								size={20}
								color={colors.textLight}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Konfirmasi password baru"
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
									name={showConfirm ? "eye-outline" : "eye-off-outline"}
									size={20}
									color={colors.textLight}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.infoBox}>
						<Ionicons name="information-circle-outline" size={20} color={colors.primary} />
						<Text style={styles.infoText}>
							Password minimal 6 karakter
						</Text>
					</View>

					<TouchableOpacity 
						style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
						onPress={handleSubmit}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.submitButtonText}>Reset Password</Text>
						)}
					</TouchableOpacity>

					<View style={styles.backContainer}>
						<TouchableOpacity 
							onPress={() => onNavigate && onNavigate('login')}
							disabled={loading}
						>
							<Text style={styles.backLink}>Kembali ke Masuk</Text>
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
		backgroundColor: colors.background,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		paddingHorizontal: 24,
		paddingVertical: 40,
	},
	header: {
		alignItems: "center",
		marginBottom: 24,
	},
	iconContainer: {
		width: 92,
		height: 92,
		borderRadius: 46,
		backgroundColor: `${colors.primary}15`,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.text,
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 14,
		color: colors.textLight,
		textAlign: "center",
		paddingHorizontal: 16,
	},
	form: {
		width: "100%",
		marginTop: 10,
	},
	inputGroup: {
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.text,
		marginBottom: 8,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.card,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: colors.border,
		paddingHorizontal: 16,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		height: 50,
		fontSize: 15,
		color: colors.text,
	},
	eyeIcon: {
		padding: 4,
	},
	infoBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: `${colors.primary}10`,
		borderRadius: 8,
		padding: 12,
		marginBottom: 20,
	},
	infoText: {
		fontSize: 13,
		color: colors.text,
		marginLeft: 8,
		flex: 1,
	},
	submitButton: {
		backgroundColor: colors.primary,
		borderRadius: 12,
		height: 52,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	submitButtonDisabled: {
		opacity: 0.6,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	backContainer: {
		marginTop: 20,
		alignItems: "center",
	},
	backLink: {
		color: colors.primary,
		fontWeight: "600",
	},
});