import type { IRide } from "../IRide";

export interface ResponseRideData {
    statusCode: number,
    message: string,
    data: IRide | [],
}