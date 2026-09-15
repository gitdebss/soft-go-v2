import type { ITransportRideType } from "./ITransportRide";

export interface IRide {
    id: number;
    date: Date;
    hour: string;
    city: string;
    name: string;
    transportType: ITransportRideType;
    complement?: string;
    total_spots: number;
    obs?: string;
    phone?: string;
}