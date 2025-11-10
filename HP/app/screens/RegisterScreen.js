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

export default function RegisterScreen({ onNavigate, onLogin }) {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleRegister = () => {
		if (
			!fullName.trim() ||
			!email.trim() ||
			!username.trim() ||
			!password.trim() ||
			!confirmPassword.trim()
		) {
			Alert.alert("Error", "Semua field harus diisi");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Password tidak cocok");
			return;
		}

		// Register success, langsung login ke dashboard
		Alert.alert("Sukses", "Akun berhasil dibuat!", [
			{ text: "OK", onPress: () => onLogin && onLogin() },
		]);
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
					<Text style={styles.title}>Daftar</Text>
					<Text style={styles.subtitle}>
						Buat akun baru untuk memulai perjalanan kesehatan Anda
					</Text>
				</View>

				<View style={styles.form}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Nama Lengkap</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="person-outline"
								size={20}
								color={colors.textLight}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Masukkan nama lengkap"
								value={fullName}
								onChangeText={setFullName}
							/>
						</View>
					</View>

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
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Username</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="at-outline"
								size={20}
								color={colors.textLight}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Masukkan username"
								value={username}
								onChangeText={setUsername}
								autoCapitalize="none"
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Password</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="lock-closed-outline"
								size={20}
								color={colors.textLight}
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Masukkan password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
							/>
							<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
								placeholder="Konfirmasi password"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry={!showConfirmPassword}
							/>
							<TouchableOpacity
								onPress={() => setShowConfirmPassword(!showConfirmPassword)}
							>
								<Ionicons
									name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
									size={20}
									color={colors.textLight}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
						<Text style={styles.registerButtonText}>Daftar</Text>
					</TouchableOpacity>

					<View style={styles.loginContainer}>
						<Text style={styles.loginText}>Sudah punya akun? </Text>
						<TouchableOpacity onPress={() => onNavigate && onNavigate('login')}>
							<Text style={styles.loginLink}>Masuk</Text>
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
		marginBottom: 32,
		alignItems: 'center'
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.text,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		color: colors.textLight,
		textAlign: 'center'
	},
	form: {
		width: "100%",
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
	registerButton: {
		backgroundColor: colors.primary,
		borderRadius: 12,
		height: 52,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	registerButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	loginContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	loginText: {
		fontSize: 14,
		color: colors.textLight,
	},
	loginLink: {
		fontSize: 14,
		color: colors.primary,
		fontWeight: "700",
	},
});