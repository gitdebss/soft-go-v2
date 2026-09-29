import type { IRide } from "../models/IRide";

type OccupancyRide = Pick<IRide, "totalSpots" | "occupiedSpots">;

// Texto original, o que aparece na tela: "1/3 Vagas" ou "1 confirmadas".
export function formatOccupancyVisible(ride: OccupancyRide): string {
  if (ride.totalSpots === null) {
    return `${ride.occupiedSpots} confirmadas`;
  }

  return `${ride.occupiedSpots}/${ride.totalSpots} Vagas`;
}

// Versão só para leitor de tela: a barra "/" não é lida de forma natural, e
// "1 confirmadas" tem concordância errada. Usar com `sr-only` ao lado do
// texto visível (que fica `aria-hidden`) - nunca no lugar dele.
export function formatOccupancySpoken(ride: OccupancyRide): string {
  if (ride.totalSpots === null) {
    return ride.occupiedSpots === 1
      ? "1 passageira confirmada"
      : `${ride.occupiedSpots} passageiras confirmadas`;
  }

  return `${ride.occupiedSpots} de ${ride.totalSpots} vagas ocupadas`;
}
