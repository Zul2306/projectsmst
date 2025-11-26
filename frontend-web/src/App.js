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
import DashboardPage from "./components/DashboardPage";
import Predict from "./components/DiabetesPredictor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/Predict" element={<Predict/>} />
      </Routes>
    </Router>
  );
}

export default App;
