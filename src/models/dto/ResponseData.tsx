import type { IRide } from "../IRide";

export interface ResponseRideData {
    statusCode: number,
    message: string,
    data: IRide[]
}

// O desfecho do cancelamento é decidido pelo backend: com passageiras a carona
// fica no mural como "canceled", sem passageiras sai dele como "deleted".
export interface ResponseCancelRideData {
    statusCode: number,
    message: string,
    data: {
        id: number,
        status: "canceled" | "deleted"
    }
}
