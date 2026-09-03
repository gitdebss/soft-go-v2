export interface IRide {
    id: number;
    date: Date;
    hour: string;
    city: string;
    region: string;
    name: string;
    phone?: string;
    totalSpots: number;
    occupiedSpots: number;
    transportType: string;
    observation?: string;
}