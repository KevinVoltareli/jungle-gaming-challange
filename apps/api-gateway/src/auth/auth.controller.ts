import {
  Body,
  Controller,
  Post,
  HttpException,
  UnauthorizedException,
  InternalServerErrorException,
  Get,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AxiosError } from "axios";

@ApiTags("Auth")
@Controller("api/auth")
export class AuthController {
  private readonly authBaseUrl =
    process.env.AUTH_SERVICE_URL ?? "http://localhost:3002";

  constructor(private readonly http: HttpService) {}

  @Get("users")
  @ApiOperation({ summary: "Listar usuários" })
  async listUsers() {
    const { data } = await this.http.axiosRef.get(
      `${this.authBaseUrl}/auth/users`
    );
    return data;
  }

  @Post("login")
  @ApiOperation({ summary: "Login" })
  async login(@Body() body: any) {
    try {
      const { data } = await this.http.axiosRef.post(
        `${this.authBaseUrl}/auth/login`,
        body
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<any>;

      // Se houve resposta do auth-service
      if (err.response) {
        const data = err.response.data as any;
        const statusFromBody =
          typeof data?.statusCode === "number" ? data.statusCode : undefined;
        const status = statusFromBody ?? err.response.status ?? 500;

        // credencial inválida -> 401 pro cliente
        if (status === 401) {
          // aqui você pode usar a mensagem que quiser, o front já trata 401,
          // mas "Invalid credentials" deixa explícito
          throw new UnauthorizedException("Invalid credentials");
        }

        // outros erros do auth-service: repassa status + message
        throw new HttpException(data?.message ?? "Auth service error", status);
      }

      // erro de rede / sem resposta
      throw new InternalServerErrorException("Auth gateway error");
    }
  }

  @Post("register")
  @ApiOperation({ summary: "Registrar usuário" })
  async register(@Body() body: any) {
    try {
      const { data } = await this.http.axiosRef.post(
        `${this.authBaseUrl}/auth/register`,
        body
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<any>;

      if (err.response) {
        const data = err.response.data as any;
        const statusFromBody =
          typeof data?.statusCode === "number" ? data.statusCode : undefined;
        const status = statusFromBody ?? err.response.status ?? 500;

        throw new HttpException(data?.message ?? "Auth service error", status);
      }

      throw new InternalServerErrorException("Auth gateway error");
    }
  }

  @Post("refresh")
  @ApiOperation({ summary: "Atualizar access token" })
  async refresh(@Body() body: any) {
    try {
      const { data } = await this.http.axiosRef.post(
        `${this.authBaseUrl}/auth/refresh`,
        body
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<any>;

      if (err.response) {
        const data = err.response.data as any;
        const statusFromBody =
          typeof data?.statusCode === "number" ? data.statusCode : undefined;
        const status = statusFromBody ?? err.response.status ?? 500;

        throw new HttpException(data?.message ?? "Auth service error", status);
      }

      throw new InternalServerErrorException("Auth gateway error");
    }
  }
}
