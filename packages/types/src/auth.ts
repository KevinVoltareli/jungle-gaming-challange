export interface JwtPayload {
  sub: string; // userId
  username: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
