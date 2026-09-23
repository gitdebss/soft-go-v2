import type { IUser } from "../IUser";

export interface ResponseAuthData {
  accessToken: string;
}

export interface ResponseUserData {
  statusCode: number;
  message: string;
  data: IUser;
}
