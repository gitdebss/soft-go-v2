import type { TransportRideType } from "./ITransportRide";

export interface IRide {
    id: number;
    date: Date;
    hour: string;
    city: string;
    name: string;
    transportType: TransportRideType;
    complement?: string;
    total_spots: number;
    obs?: string;
    phone?: string;
}