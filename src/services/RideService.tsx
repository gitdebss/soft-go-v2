import type { CreateRide } from "../models/dto/CreateRide";
import type { ResponseRideData } from "../models/dto/ResponseData";
import type { IRide } from "../models/IRide";

const API_URL = "http://localhost:3000/rides";

export class RideService {
  constructor() {}

  async loadRides(): Promise<IRide[]> {
    const data = await this.getAllRides();

    return data.flatMap((ride) => ride.data)
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  async getAllRides(search?: string): Promise<ResponseRideData[]> {
    const url = search
      ? `${API_URL}?search=${encodeURIComponent(search)}`
      : API_URL;

    return this.request<ResponseRideData[]>(url);
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
