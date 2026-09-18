import axios from "axios"
import type { CreateUserRide } from "../models/dto/CreateUserRide"
import type { ResponseRideData } from "../models/dto/ResponseData"

const API_URL = 'http://localhost:3000/user-ride'

export class UserRideService{

async getAllUsers(): Promise<ResponseRideData> {
    const response = await axios.get<ResponseRideData>(API_URL)

    return response.data
}

async getUsersByRideId(id: number): Promise<ResponseRideData> {
    const response = await axios.get<ResponseRideData>(`${API_URL}/${id}`)

    return response.data
}

async createUserRide(user : CreateUserRide, id: number): Promise<ResponseRideData> {
    const response = await axios.post(`${API_URL}/${id}`, user)

    return response.data
}
}

