import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import { useAuth } from "../context/AuthContext";

const SignInWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return <SignIn onToggle={() => navigate("/register")} />;
};

export default SignInWrapper;
