// App.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import ForgotPasswordScreen from "./app/screens/ForgotPasswordScreen";
import VerifyOTPScreen from "./app/screens/VerifyOTPScreen";
import ResetPasswordScreen from "./app/screens/ResetPasswordScreen";
import MainLayout from "./app/screens/MainLayout";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [screenParams, setScreenParams] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Navigation helper:
  const navigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  // Load token at startup
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem("token");
        if (t) setToken(t);
      } catch (err) {
        console.log("Failed to load token", err);
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async (receivedToken) => {
    await AsyncStorage.setItem("token", receivedToken);
    setToken(receivedToken);
    setCurrentScreen("dashboard");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setCurrentScreen("login");
  };

  // Loading screen
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If logged in → dashboard
  if (token) {
    return <MainLayout token={token} onLogout={handleLogout} />;
  }

  // ---------- AUTH ROUTES ----------
  switch (currentScreen) {
    case "register":
      return <RegisterScreen onNavigate={navigate} onLogin={handleLogin} />;

    case "forgot":
      return <ForgotPasswordScreen onNavigate={navigate} />;

    case "otp":
      return (
        <VerifyOTPScreen
          onNavigate={navigate}
          route={{ params: screenParams }}
        />
      );

    case "reset":
      return (
        <ResetPasswordScreen
          onNavigate={navigate}
          route={{ params: screenParams }}
        />
      );

    default:
      return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
  }
}
