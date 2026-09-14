import type { IUserRide } from "../IUserRide";

export interface ResponseUserRideData {
    statusCode: number,
    message: string,
    data: IUserRide,
}