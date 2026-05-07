import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

const normalizeUser = (user) => ({
  ...user,
  id: user.id || user._id
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? normalizeUser(JSON.parse(stored)) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const currentUser = await fetchMe();
        const normalized = normalizeUser(currentUser);
        setUser(normalized);
        localStorage.setItem('user', JSON.stringify(normalized));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('token', data.token);
    const normalized = normalizeUser(data.user);
    localStorage.setItem('user', JSON.stringify(normalized));
    setUser(normalized);
  };

  const login = async (payload) => {
    const data = await loginUser(payload);
    persistSession(data);
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
