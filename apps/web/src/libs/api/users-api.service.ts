import { ApiClient } from "./api-client";
import type { UserDto } from "./types";

export class UsersApiService {
  constructor(private readonly client: ApiClient) {}

  async listUsers(): Promise<UserDto[]> {
    // API_BASE_URL já deve ser "http://localhost:3001/api"
    // então aqui é só /auth/users mesmo
    return this.client.get<UserDto[]>("api/auth/users");
  }
}
