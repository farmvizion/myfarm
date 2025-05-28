import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import { useAuth } from "../context/AuthContext";

const RegisterWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return <Register onToggle={() => navigate("/signin")} />;
};

export default RegisterWrapper;
