import type { CreateUserRide } from "../models/dto/CreateUserRide"
import type { ResponseUserRideData } from "../models/dto/ResponseUserRideData"

const API_URL = 'http://localhost:3000/user-ride'

export async function getAllUsers(): Promise<ResponseUserRideData[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Erro ao buscar usuários')
    }

    return response.json()
}

export async function getUsersByRideId(id: number): Promise<ResponseUserRideData> {
    const url = `${API_URL}/${id}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Erro ao buscar usuários')
    }

    return response.json()
}

export async function createUserRide(user : CreateUserRide, id: number): Promise<ResponseUserRideData> {
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

