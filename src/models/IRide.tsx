import type { ITransportRideType } from "./ITransportRide";

// `deleted` nunca chega ao frontend: uma carona nesse estado sai do mural.
export type RideStatus = "active" | "canceled";

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
    phone?: string | null;
    status: RideStatus;
    isOwner: boolean;
    alreadyJoined: boolean;
}
