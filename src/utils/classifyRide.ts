import type { IRide } from "../models/IRide";

export type RideLifecycleStatus = "ativa" | "inativa" | "cancelada";

// Puramente derivado de status + date, nunca persistido: uma corrida cancelada
// é "cancelada" em qualquer data; uma ativa vira "inativa" só depois de ocorrer.
export function classifyRide(
  ride: Pick<IRide, "status" | "date">,
  today: string,
): RideLifecycleStatus {
  if (ride.status === "canceled") return "cancelada";

  return ride.date < today ? "inativa" : "ativa";
}
