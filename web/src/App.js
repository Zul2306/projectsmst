// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import LoginPage from "./components/LoginPage";
// // import DashboardPage from "./pages/DashboardPage"; // opsional
// import DiabetesPage from "./components/DiabetesPredictor"; // opsional

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/diabetes" element={<DiabetesPage />} />
//         {/* <Route path="/register" element={<RegisterPage />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import Predict from "./components/DiabetesPredictor";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOTPScreen from "./components/VerifyOTPScreen";
import ResetPassword from "./components/ResetPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/Predict" element={<Predict />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/VerifyOTP" element={<VerifyOTPScreen />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
