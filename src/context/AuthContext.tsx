import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string;
  token: string | null;
  user: User | null;
  login: (token: string, role: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole");
    const storedUser = localStorage.getItem("userInfo");

    if (storedToken) setToken(storedToken);
    if (storedRole) setUserRole(storedRole);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = (newToken: string, role: string, user: User) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userInfo", JSON.stringify(user));

    setToken(newToken);
    setUserRole(role);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");

    setToken(null);
    setUserRole("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        userRole,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
