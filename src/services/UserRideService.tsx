import { apiClient } from "../lib/apiClient";
import type { IUserRide } from "../models/IUserRide";

const USER_RIDE_PATH = "/user-ride";

interface ResponseUserRideData {
  statusCode: number;
  message: string;
  data: IUserRide[];
}

interface ResponseSingleUserRideData {
  statusCode: number;
  message: string;
  data: IUserRide;
}

export class UserRideService {
  async getUsersByRideId(idRide: number): Promise<ResponseUserRideData> {
    const response = await apiClient.get<ResponseUserRideData>(
      `${USER_RIDE_PATH}/${idRide}`,
    );

    return response.data;
  }

  // Sem corpo: quem confirma presença é a usuária do token.
  async createUserRide(idRide: number): Promise<ResponseSingleUserRideData> {
    const response = await apiClient.post<ResponseSingleUserRideData>(
      `${USER_RIDE_PATH}/${idRide}`,
    );

    return response.data;
  }
}
