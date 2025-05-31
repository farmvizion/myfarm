import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import SignInWrapper from "./auth/SignInWrapper";
import RegisterWrapper from "./auth/RegisterWrapper";
import ProtectedRoute from "./ProtectedRoute";
import FarmPlan from "./pages/FarmPlan";
import ResetPassword from "./auth/ResetPassword";  // fixed import name here
import ForgotPassword from "./auth/ForgotPassword";
import StylishForm from "./pages/FarmForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./AdminRoute";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="team" element={<Team />} />
        <Route path="contact" element={<Contact />} />
        <Route path="signin" element={<SignInWrapper />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="register" element={<RegisterWrapper />} />

        <Route
          path="forgotpassword"
          element={
            <ForgotPassword
              onBackToSignIn={() => {
                navigate("/signin");
              }}
            />
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="farmplan" element={<StylishForm />} />
          {/* other protected routes */}
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
