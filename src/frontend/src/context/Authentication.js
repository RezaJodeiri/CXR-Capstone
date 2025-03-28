import { createContext, useState, useEffect, useContext } from "react";
import { signIn, signUp, getSelfUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await signIn(email, password);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        navigate("/patients");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response?.status === 401) {
        throw new Error("Invalid credentials");
      }
      throw error;
    }
  };

  const register = async (email, password, userDetails) => {
    try {
      const response = await signUp(email, password, userDetails);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        navigate("/patients");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response?.status === 500) {
        throw new Error(error.response.data.error || "Registration failed");
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const getToken = () => {
    return token || localStorage.getItem("token");
  };

  // Add token validation
  const validateToken = async () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      try {
        const user = await getSelfUser(currentToken);
        setUser(user);
        return true;
      } catch (error) {
        logout();
        return false;
      }
    }
    return false;
  };

  // Check token validity on mount
  useEffect(() => {
    validateToken().finally(() => setLoading(false));
  }, []);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    getToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
