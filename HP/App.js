import React, { useState } from 'react';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import ForgotPasswordScreen from './app/screens/ForgotPasswordScreen';
import MainLayout from './app/screens/MainLayout';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  if (isLoggedIn) {
    return <MainLayout onLogout={handleLogout} />;
  }

  if (currentScreen === 'register') {
    return <RegisterScreen onNavigate={setCurrentScreen} onLogin={handleLogin} />;
  } else if (currentScreen === 'forgot') {
    return <ForgotPasswordScreen onNavigate={setCurrentScreen} />;
  } else {
    return <LoginScreen onNavigate={setCurrentScreen} onLogin={handleLogin} />;
  }
}