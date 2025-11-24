// App.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import ForgotPasswordScreen from "./app/screens/ForgotPasswordScreen";
import MainLayout from "./app/screens/MainLayout";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [token, setToken] = useState(null); // JWT token
  const [loading, setLoading] = useState(true);

  // attempt to load token from storage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const t = await AsyncStorage.getItem("token");
        if (t) {
          setToken(t);
        }
      } catch (err) {
        console.log("Failed to load token", err);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const handleLogin = async (receivedToken) => {
    // receivedToken is expected to be the JWT string from backend
    try {
      await AsyncStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setCurrentScreen("dashboard"); // optional
    } catch (err) {
      console.log("Failed to save token", err);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (err) {
      console.log("Failed to remove token", err);
    } finally {
      setToken(null);
      setCurrentScreen("login");
    }
  };

  // While loading token from storage show spinner
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If token exists -> user is logged in
  if (token) {
    return <MainLayout token={token} onLogout={handleLogout} />;
  }

  // Not logged in -> show auth screens
  if (currentScreen === "register") {
    // Note: RegisterScreen should call onLogin(token) if you want auto-login after register.
    return (
      <RegisterScreen
        onNavigate={setCurrentScreen}
        onLogin={(t) => handleLogin(t)} // expects token, or you can call setCurrentScreen('login')
      />
    );
  } else if (currentScreen === "forgot") {
    return <ForgotPasswordScreen onNavigate={setCurrentScreen} />;
  } else {
    return (
      <LoginScreen
        onNavigate={setCurrentScreen}
        onLogin={(t) => handleLogin(t)} // expects token string from LoginScreen
      />
    );
  }
}
