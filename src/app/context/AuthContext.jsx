"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
    }

    setLoading(false);

  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{
        user,
        accessToken,
        loading,
        login,
        logout,
        setUser,
        setAccessToken,
        isAuthenticated: !!user,
    }}>
        {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);