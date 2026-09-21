import type { ITransportRideType } from "./ITransportRide";

export interface IRide {
    id: number;
    date: string;
    hour: string;
    city: string;
    name: string;
    transportType: ITransportRideType;
    complement?: string;
    totalSpots: number;
    occupiedSpots: number;
    availableSpots: number;
    obs?: string;
    phone?: string;
}