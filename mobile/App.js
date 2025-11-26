// // App.js
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import LoginScreen from "./app/screens/LoginScreen";
// import RegisterScreen from "./app/screens/RegisterScreen";
// import ForgotPasswordScreen from "./app/screens/ForgotPasswordScreen";
// import VerifyOTPScreen from "./app/screens/VerifyOTPScreen";
// import ResetPasswordScreen from "./app/screens/ResetPasswordScreen";
// import MainLayout from "./app/screens/MainLayout";

// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState("login");
//   const [screenParams, setScreenParams] = useState({});
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Navigation helper:
//   const navigate = (screen, params = {}) => {
//     setCurrentScreen(screen);
//     setScreenParams(params);
//   };

//   // Load token at startup
//   useEffect(() => {
//     (async () => {
//       try {
//         const t = await AsyncStorage.getItem("token");
//         if (t) setToken(t);
//       } catch (err) {
//         console.log("Failed to load token", err);
//       }
//       setLoading(false);
//     })();
//   }, []);

//   const handleLogin = async (receivedToken) => {
//     await AsyncStorage.setItem("token", receivedToken);
//     setToken(receivedToken);
//     setCurrentScreen("dashboard");
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("token");
//     setToken(null);
//     setCurrentScreen("login");
//   };

//   // Loading screen
//   if (loading) {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // If logged in → dashboard
//   if (token) {
//     return <MainLayout token={token} onLogout={handleLogout} />;
//   }

//   // ---------- AUTH ROUTES ----------
//   switch (currentScreen) {
//     case "register":
//       return <RegisterScreen onNavigate={navigate} onLogin={handleLogin} />;

//     case "forgot":
//       return <ForgotPasswordScreen onNavigate={navigate} />;

//     case "otp":
//       return (
//         <VerifyOTPScreen
//           onNavigate={navigate}
//           route={{ params: screenParams }}
//         />
//       );

//     case "reset":
//       return (
//         <ResetPasswordScreen
//           onNavigate={navigate}
//           route={{ params: screenParams }}
//         />
//       );

//     default:
//       return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
//   }
// }


// App.js
import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import ForgotPasswordScreen from "./app/screens/ForgotPasswordScreen";
import VerifyOTPScreen from "./app/screens/VerifyOTPScreen";
import ResetPasswordScreen from "./app/screens/ResetPasswordScreen";
import MainLayout from "./app/screens/MainLayout";
import API_URL from "./app/utils/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [screenParams, setScreenParams] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutTimerRef = useRef(null);

  const navigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  // decode JWT payload (base64url) to JSON. Return null if gagal.
  const decodeJwtPayload = (jwt) => {
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) return null;
      const payload = parts[1];
      // base64url -> base64
      let b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      let jsonStr;
      if (typeof atob === "function") {
        jsonStr = decodeURIComponent(
          Array.prototype.map
            .call(atob(b64), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
      } else if (typeof Buffer !== "undefined") {
        jsonStr = Buffer.from(b64, "base64").toString("utf8");
      } else {
        return null;
      }
      return JSON.parse(jsonStr);
    } catch (e) {
      return null;
    }
  };

  const scheduleAutoLogout = (jwt) => {
    try {
      const payload = decodeJwtPayload(jwt);
      if (!payload || !payload.exp) return;

      const expiryMs = payload.exp * 1000;
      const now = Date.now();
      const msLeft = expiryMs - now;

      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }

      if (msLeft <= 0) {
        // already expired: force logout
        handleLogout();
        return;
      }

      // schedule logout a little after expiry
      logoutTimerRef.current = setTimeout(() => {
        Alert.alert("Sesi berakhir", "Sesi login Anda telah habis, silakan login kembali.");
        handleLogout();
      }, msLeft + 1000);
    } catch (e) {
      // ignore
    }
  };

  // STARTUP: development reload behavior + token verify + schedule logout
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // === DEVELOPMENT RELOAD BEHAVIOR ===
        // jika sedang development (Expo), hapus token di startup sehingga setiap reload akan memaksa login.
        // __DEV__ true saat bundler dev (Expo). Di production __DEV__ === false.
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          // hapus token supaya reload di expo masuk ke login
          await AsyncStorage.removeItem("token");
          // clear any lastScreen flags juga kalau ada
          await AsyncStorage.removeItem("lastScreen").catch(() => {});
        }

        // setelah (mungkin) menghapus token di dev, lanjut baca token dari storage
        const t = await AsyncStorage.getItem("token");
        if (!t) {
          if (active) setLoading(false);
          return;
        }

        // verify with backend /user/me
        const res = await fetch(`${API_URL}/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${t}`,
          },
        });

        if (res.ok) {
          if (active) {
            setToken(t);
            scheduleAutoLogout(t);
            setLoading(false);
          }
        } else {
          // invalid/expired token on server side => remove
          await AsyncStorage.removeItem("token");
          if (active) {
            setToken(null);
            setLoading(false);
          }
        }
      } catch (err) {
        console.log("Startup token check error:", err);
        try { await AsyncStorage.removeItem("token"); } catch {}
        try { await AsyncStorage.removeItem("lastScreen"); } catch {}
        if (active) { setToken(null); setLoading(false); }
      }
    })();

    return () => {
      active = false;
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const handleLogin = async (receivedToken) => {
    try {
      await AsyncStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      scheduleAutoLogout(receivedToken);
      setCurrentScreen("dashboard");
    } catch (err) {
      console.log("Failed to save token", err);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("lastScreen").catch(() => {});
    } catch (err) {
      console.log("Failed to remove token", err);
    } finally {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      setToken(null);
      setCurrentScreen("login");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (token) {
    return <MainLayout token={token} onLogout={handleLogout} />;
  }

  // AUTH ROUTES
  switch (currentScreen) {
    case "register":
      return <RegisterScreen onNavigate={navigate} onLogin={handleLogin} />;
    case "forgot":
      return <ForgotPasswordScreen onNavigate={navigate} />;
    case "otp":
      return <VerifyOTPScreen onNavigate={navigate} route={{ params: screenParams }} />;
    case "reset":
      return <ResetPasswordScreen onNavigate={navigate} route={{ params: screenParams }} />;
    default:
      return <LoginScreen onNavigate={navigate} onLogin={handleLogin} />;
  }
}
