import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm-token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.user);
          } else {
            // Token is invalid/expired
            setToken(null);
            setUser(null);
            localStorage.removeItem('crm-token');
          }
        } catch (error) {
          console.error("Failed to fetch profile during auth initialization", error);
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('crm-token', res.token);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('crm-token', res.token);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
