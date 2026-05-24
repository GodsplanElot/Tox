import { createContext } from "react";
import type { AuthUser, RegisterPendingResponse } from "../types/auth";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<RegisterPendingResponse>;
  verifyEmail: (payload: { email: string; otp: string }) => Promise<void>;
  resendOtp: (email: string) => Promise<RegisterPendingResponse>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
