import type { IRide } from "./IRide";

export interface IUserRide {
    id: number;
    ride: IRide;
    name: string;
    phone?: string;
}