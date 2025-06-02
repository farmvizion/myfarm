import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // You can also decode token for role or request user info from backend here
      login(token, 'user'); // Pass actual role if you can decode it or get from backend
      navigate('/');
    } else {
      // No token? Redirect to login or show error
      navigate('/login');
    }
  }, [login, navigate]);

  return <p>Logging you in...</p>;
};

export default LoginSuccessPage;
