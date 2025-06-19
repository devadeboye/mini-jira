export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface Tokens {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    fullName: string;
    hasCreatedProject: boolean;
  };
}

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}
