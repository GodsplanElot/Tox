import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../services/api";
import type { AuthTokens, AuthUser } from "../types/auth";
import { AuthContext } from "./authState";
import type { LoginPayload, RegisterPayload } from "./authState";

const ACCESS_TOKEN_KEY = "tox_access_token";
const REFRESH_TOKEN_KEY = "tox_refresh_token";

const storeTokens = (tokens: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to load current user:", error);
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const handleAuthCleared = () => setUser(null);
    window.addEventListener("tox-auth-cleared", handleAuthCleared);
    return () => window.removeEventListener("tox-auth-cleared", handleAuthCleared);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await api.login(payload.email, payload.password);
    storeTokens(response);
    const currentUser = await api.getCurrentUser();
    setUser(currentUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await api.register(payload);
    storeTokens(response);
    setUser(response.user ?? (await api.getCurrentUser()));
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [isLoading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
