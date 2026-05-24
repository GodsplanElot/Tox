export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type AuthResponse = AuthTokens & {
  user?: AuthUser;
};

export type RegisterPendingResponse = {
  detail: string;
  email: string;
  expires_in: number;
  resend_available_in: number;
};

export type GoogleCredentialResponse = {
  credential?: string;
};
