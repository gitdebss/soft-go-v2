import axios from "axios";
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

  async getAllRides(
    transportType?: string,
    date?: string,
  ): Promise<ResponseRideData> {
    //axios.*metodo*<*tipo da resposta*>(*url*,{*querys*})
    const response = await axios.get<ResponseRideData>(API_URL, {params: {transportType, date}})

    return response.data;
  }

  async getOneRide(id: number): Promise<ResponseRideData> {
    const response = await axios.get<ResponseRideData>(`${API_URL}/${id}`)

    return response.data;
  }

  async createRide(ride: CreateRide): Promise<ResponseRideData> {
    //axios.*metodo*<*tipo da resposta*>(*url*, *body da requisição*)
    const response = await axios.post<ResponseRideData>(API_URL, ride)

    return response.data;
  }
}
