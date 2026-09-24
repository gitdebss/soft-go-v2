import { apiClient } from "../lib/apiClient";
import type { CreateRide } from "../models/dto/CreateRide";
import type {
  ResponseCancelRideData,
  ResponseRideData,
} from "../models/dto/ResponseData";
import type { IRide } from "../models/IRide";

const RIDES_PATH = "/rides";

export class RideService {
  constructor() {}

  async loadRides(transportType?: string, date?: string): Promise<IRide[]> {
    const response = await this.getAllRides(transportType, date);

    return response.data;
  }

  async getAllRides(
    transportType?: string,
    date?: string,
  ): Promise<ResponseRideData> {
    const response = await apiClient.get<ResponseRideData>(RIDES_PATH, {
      params: { transportType, date },
    });

    return response.data;
  }

  async getOneRide(id: number): Promise<ResponseRideData> {
    const response = await apiClient.get<ResponseRideData>(
      `${RIDES_PATH}/${id}`,
    );

    return response.data;
  }

  // Sem corpo: quem cancela é a usuária do token, e o desfecho é decidido pelo
  // backend conforme a carona tenha ou não passageiras.
  async cancelRide(id: number): Promise<ResponseCancelRideData> {
    const response = await apiClient.delete<ResponseCancelRideData>(
      `${RIDES_PATH}/${id}`,
    );

    return response.data;
  }

  async createRide(ride: CreateRide): Promise<ResponseRideData> {
    const response = await apiClient.post<ResponseRideData>(RIDES_PATH, ride);

    return response.data;
  }
}
