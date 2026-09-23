import { apiClient } from "../lib/apiClient";
import type { SignUpDto } from "../models/dto/SignUp";
import type { SignInDto } from "../models/dto/SignIn";
import type {
  ResponseAuthData,
  ResponseUserData,
} from "../models/dto/ResponseAuthData";

// SPEC_DEVIATION: design.md's `ResponseAuthData` ({ accessToken }) has no
// envelope fields, unlike `ResponseUserData` which keeps the full
// { statusCode, message, data } shape. The backend's global TransformInterceptor
// still wraps every response, so signIn unwraps that envelope internally to
// match the { accessToken } return type the design specifies.
// Reason: design.md's Data Models / AuthService interfaces define the two
// return types this way; this envelope is only used to type that unwrap.
interface Envelope<T> {
  statusCode: number;
  message: string;
  data: T;
}

export class AuthService {
  constructor() {}

  async signUp(data: SignUpDto): Promise<ResponseUserData> {
    const response = await apiClient.post<ResponseUserData>(
      "/auth/signup",
      data,
    );

    return response.data;
  }

  async signIn(data: SignInDto): Promise<ResponseAuthData> {
    const response = await apiClient.post<Envelope<ResponseAuthData>>(
      "/auth/login",
      data,
    );

    return response.data.data;
  }

  async getMe(): Promise<ResponseUserData> {
    const response = await apiClient.get<ResponseUserData>("/auth/me");

    return response.data;
  }
}
