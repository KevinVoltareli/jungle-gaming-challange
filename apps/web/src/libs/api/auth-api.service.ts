import type { ApiClient } from "./api-client";

// ---- TIPOS DE REQUEST ----
export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// ---- RESPOSTA CRUA DO BACKEND ----
// Exatamente como o Nest está devolvendo hoje
interface RawUser {
  _id: string;
  _email?: { _value: string };
  _username: string;
  _roles?: string[];
}

export interface RawAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: RawUser;
}

// Tipo “bonito” que o front vai usar
export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    roles: string[];
  };
}

function mapRawToDto(raw: RawAuthResponse): AuthResponseDto {
  const rawUser = raw.user;

  return {
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    user: {
      id: rawUser._id,
      email: rawUser._email?._value ?? "",
      username: rawUser._username,
      roles: rawUser._roles ?? [],
    },
  };
}

export class AuthApiService {
  constructor(private readonly api: ApiClient) {}

  async login(payload: LoginRequest): Promise<AuthResponseDto> {
    const raw = await this.api.post<RawAuthResponse>("api/auth/login", {
      body: payload,
    });

    // se der pau no mapping, cai no onError do useAuth como erro de JS
    return mapRawToDto(raw);
  }

  async register(payload: RegisterRequest): Promise<AuthResponseDto> {
    const raw = await this.api.post<RawAuthResponse>("api/auth/register", {
      body: payload,
    });

    return mapRawToDto(raw);
  }
}
