export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface RefreshTokenPayload {
  jti: string; // JWT ID (unique identifier for the token)
  sub: string; // Subject (user ID)
  iat?: number; // Issued at
  exp?: number; // Expiration time
}
