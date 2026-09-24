export interface CreateRide {
    date: string;
    hour: string;
    city: string;
    complement?: string | null;
    transportTypeId: number;
    totalSpots: number;
    obs?: string | null;
}
