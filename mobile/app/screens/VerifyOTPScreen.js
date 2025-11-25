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
				<View style={styles.header}>
					<View style={styles.iconContainer}>
						<Ionicons name="mail-outline" size={48} color={colors.primary} />
					</View>
					<Text style={styles.title}>Verifikasi OTP</Text>
					<Text style={styles.subtitle}>
						Masukkan kode 6 digit yang telah dikirim ke{"\n"}
						<Text style={styles.email}>{email}</Text>
					</Text>
				</View>

				<View style={styles.form}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Kode OTP</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="keypad-outline"
								size={20}
								color={colors.textLight}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Masukkan kode 6 digit"
								value={otp}
								onChangeText={setOtp}
								keyboardType="numeric"
								maxLength={6}
								editable={!loading}
							/>
						</View>
					</View>

					<TouchableOpacity 
						style={[styles.verifyButton, loading && styles.verifyButtonDisabled]} 
						onPress={handleVerify}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.verifyButtonText}>Verifikasi</Text>
						)}
					</TouchableOpacity>

					<View style={styles.resendContainer}>
						<Text style={styles.resendText}>Tidak menerima kode? </Text>
						<TouchableOpacity 
							onPress={handleResend}
							disabled={loading}
						>
							<Text style={styles.resendLink}>Kirim Ulang</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.backContainer}>
						<TouchableOpacity 
							onPress={() => onNavigate && onNavigate('forgot')}
							disabled={loading}
						>
							<Text style={styles.backLink}>Kembali</Text>
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
	email: {
		fontWeight: "600",
		color: colors.primary,
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
		letterSpacing: 8,
		fontWeight: "600",
	},
	verifyButton: {
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
	verifyButtonDisabled: {
		opacity: 0.6,
	},
	verifyButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	resendContainer: {
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	resendText: {
		fontSize: 14,
		color: colors.textLight,
	},
	resendLink: {
		fontSize: 14,
		color: colors.primary,
		fontWeight: "600",
	},
	backContainer: {
		marginTop: 12,
		alignItems: "center",
	},
	backLink: {
		color: colors.primary,
		fontWeight: "600",
	},
});