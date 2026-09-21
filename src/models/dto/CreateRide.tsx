export interface CreateRide {
    name: string;
    date: string;
    hour: string;
    city: string;
    complement?: string | null;
    transportTypeId: number;
    totalSpots: number;
    obs?: string | null;
    phone?: string | null;
}