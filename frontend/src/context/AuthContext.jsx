import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import { storage } from '../utils/storage';
import { getApiErrorMessage } from '../utils/errorMessage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [accessToken, setAccessToken] = useState(storage.getAccessToken());
  const [refreshToken, setRefreshToken] = useState(storage.getRefreshToken());

  useEffect(() => {
    storage.setUser(user);
  }, [user]);

  const login = async (credentials) => {
    try {
      const res = await authApi.login(credentials);
      const d = res.data;
      storage.setUser(d.user);
      storage.setAccessToken(d.accessToken);
      storage.setRefreshToken(d.refreshToken);
      setUser(d.user);
      setAccessToken(d.accessToken);
      setRefreshToken(d.refreshToken);
      return d;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Login failed'));
    }
  };

  const logout = async () => {
    try {
      const rt = storage.getRefreshToken();
      await authApi.logout(rt);
    } catch (e) {
      // ignore
    }
    storage.clearAll();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const value = { user, accessToken, refreshToken, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
