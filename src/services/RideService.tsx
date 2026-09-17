import type { CreateRide } from "../models/dto/CreateRide";
import type { ResponseRideData } from "../models/dto/ResponseData";
import type { IRide } from "../models/IRide";

const API_URL = "http://localhost:3000/rides";

export class RideService {
  constructor() {}

  async loadRides(transportType?: string, date?: string): Promise<IRide[]> {
    const response = await this.getAllRides(transportType, date);

    return response.data;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  async getAllRides(
    transportType?: string,
    date?: string,
  ): Promise<ResponseRideData> {
    const params = new URLSearchParams();
    if (transportType) {
      params.append("transportType", transportType);
    }

    if (date) {
      params.append("date", date);
    }

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;

    return this.request<ResponseRideData>(url);
  }

  async getOneRide(id: number): Promise<ResponseRideData> {
    return this.request<ResponseRideData>(`${API_URL}/${id}`);
  }

  async createRide(ride: CreateRide): Promise<ResponseRideData> {
    return this.request<ResponseRideData>(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ride),
    });
  }
}
