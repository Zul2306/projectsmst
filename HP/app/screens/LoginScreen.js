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

export default function LoginScreen({ onNavigate, onLogin }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = () => {
		if (!username.trim() || !password.trim()) {
			Alert.alert("Error", "Username dan password harus diisi");
			return;
		}
		// Simulate login success and navigate to dashboard
		onLogin && onLogin();
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
						<Ionicons name="medical" size={50} color={colors.primary} />
					</View>
					<Text style={styles.title}>Selamat Datang</Text>
					<Text style={styles.subtitle}>
						Masuk untuk melanjutkan ke aplikasi
					</Text>
				</View>

				<View style={styles.form}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Username</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="person-outline"
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
							<TouchableOpacity
								onPress={() => setShowPassword(!showPassword)}
							>
								<Ionicons
									name={showPassword ? "eye-outline" : "eye-off-outline"}
									size={20}
									color={colors.textLight}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<TouchableOpacity onPress={() => onNavigate && onNavigate('forgot')}>
						<Text style={styles.forgotText}>Lupa Password?</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
						<Text style={styles.loginButtonText}>Masuk</Text>
					</TouchableOpacity>

					<View style={styles.registerContainer}>
						<Text style={styles.registerText}>Belum punya akun? </Text>
						<TouchableOpacity onPress={() => onNavigate && onNavigate('register')}>
							<Text style={styles.registerLink}>Daftar</Text>
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
		marginBottom: 40,
	},
	iconContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: `${colors.primary}15`,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 24,
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
		textAlign: "center",
	},
	form: {
		width: "100%",
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
	forgotText: {
		color: colors.primary,
		textAlign: "right",
		marginBottom: 24,
		fontWeight: "600",
	},
	loginButton: {
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
	loginButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	registerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	registerText: {
		fontSize: 14,
		color: colors.textLight,
	},
	registerLink: {
		fontSize: 14,
		color: colors.primary,
		fontWeight: "700",
	},
});