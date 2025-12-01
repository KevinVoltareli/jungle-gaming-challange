export interface IJwtTokenService {
  signAccessToken(payload: any): string;
  signRefreshToken(payload: any): string;
  verifyRefreshToken(token: string): any;
}
