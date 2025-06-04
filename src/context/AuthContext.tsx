import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string;
  user: {
    name: string;
    email: string;
  } | null;
  login: (token: string, role: string, user: { name: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const userInfo = localStorage.getItem("userInfo");

    setIsAuthenticated(!!token);
    setUserRole(role || "");
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = (token: string, role: string, user: { name: string; email: string }) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userInfo", JSON.stringify(user));
    setIsAuthenticated(true);
    setUserRole(role);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    setIsAuthenticated(false);
    setUserRole("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
