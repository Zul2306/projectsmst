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

export default function ForgotPasswordScreen({ onNavigate }) {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleReset = async () => {
		if (!email.trim()) {
			Alert.alert("Error", "Masukkan email");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/auth/forgot-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (res.ok) {
				onNavigate("otp", { email });
			} else {
				Alert.alert("Error", "Email tidak ditemukan");
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
						<Ionicons name="help-circle-outline" size={48} color={colors.primary} />
					</View>
					<Text style={styles.title}>Lupa Password</Text>
					<Text style={styles.subtitle}>
						Masukkan email yang terdaftar. Kami akan mengirimkan kode OTP untuk
						mereset password.
					</Text>
				</View>

				<View style={styles.form}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Email</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="mail-outline"
								size={20}
								color={colors.textLight}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Masukkan email"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								editable={!loading}
							/>
						</View>
					</View>

					<TouchableOpacity 
						style={[styles.resetButton, loading && styles.resetButtonDisabled]} 
						onPress={handleReset}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.resetButtonText}>Kirim Kode OTP</Text>
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
	},
	resetButton: {
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
	resetButtonDisabled: {
		opacity: 0.6,
	},
	resetButtonText: {
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