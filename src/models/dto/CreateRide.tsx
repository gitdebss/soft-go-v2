export interface CreateRide {
    name: string;
    date: string;
    hour: string;
    city: string;
    complement?: string;
    transportTypeId: number;
    totalSpots: number;
    obs?: string;
    phone?: string;
}