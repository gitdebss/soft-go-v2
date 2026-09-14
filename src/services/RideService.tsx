import type { ResponseRideData } from "../models/dto/ResponseRideData"
import type { IRide } from "../models/IRide"

const API_URL = 'http://localhost:3000/rides'

export async function getAllRides(search: string | null): Promise<ResponseRideData[]> {
    const url = search
        ? `${API_URL}?search=${encodeURIComponent(search)}`
        : `${API_URL}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Erro ao buscar caronas')
    }

    return response.json()
}

export async function getOneRide(id: number): Promise<ResponseRideData> {
    const url = `${API_URL}/${id}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Erro ao buscar carona')
    }

    return response.json()
}

export async function createRide(ride : IRide): Promise<ResponseRideData> {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ride),
    })

    if (!response.ok) {
        throw new Error('Erro ao criar carona')
    }

    return response.json()
}

