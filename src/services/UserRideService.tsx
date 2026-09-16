import type { CreateUserRide } from "../models/dto/CreateUserRide"
import type { ResponseRideData } from "../models/dto/ResponseData"

const API_URL = 'http://localhost:3000/user-ride'

export class UserRideService{

async getAllUsers(): Promise<ResponseRideData[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Erro ao buscar usuários')
    }

    return response.json()
}

async getUsersByRideId(id: number): Promise<ResponseRideData> {
    const url = `${API_URL}/${id}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Erro ao buscar usuários')
    }

    return response.json()
}

async createUserRide(user : CreateUserRide, id: number): Promise<ResponseRideData> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })

    if (!response.ok) {
        throw new Error('Erro ao adicionar passageiro na carona')
    }

    return response.json()
}
}

