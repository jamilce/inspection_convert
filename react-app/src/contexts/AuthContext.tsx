import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.ts';

interface User {
  token: string;
  FullName: string;
  JobTitle: string;
  EmployeeID: string;
  DeptID: string;
  DeptNameAr: string;
  DeptNameEn: string;
  inslang: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  hasPrivilege: (privilege: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('SmartAudit');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.removeItem('SmartAudit');
      }
    }
    setLoading(false);
  }, []);

  // Keep session alive - check token validity periodically
  useEffect(() => {
    if (!user?.token) return;

    const checkTokenValidity = async () => {
      try {
        const isValid = await api.auth.isTokenValid();
        if (!isValid) {
          logout();
        }
      } catch (error) {
        console.error('Token validation error:', error);
        // Don't logout on network errors, only on explicit 401
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenValidity, 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.auth.login(username, password);
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('SmartAudit', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('SmartAudit');
    sessionStorage.clear();
  };

  const checkAuth = (): boolean => {
    return !!user?.token;
  };

  const hasPrivilege = (_privilege: string): boolean => {
    // Port privilege checking logic from PageAuthorized function
    if (!user) return false;
    // TODO: Implement actual privilege checking based on user roles
    // For now, allow all authenticated users
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        checkAuth,
        hasPrivilege,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
