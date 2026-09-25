import type { RideLifecycleStatus } from "../utils/classifyRide";

// Sem sentinela "Todas" (diferente de FilterOptions): desmarcar tudo volta a
// mostrar só "ativa", decisão da usuária registrada em design.md.
export const MyRidesStatusFilterOptions: { label: string; value: RideLifecycleStatus }[] = [
  { label: "Ativas", value: "ativa" },
  { label: "Inativas", value: "inativa" },
  { label: "Canceladas", value: "cancelada" },
];
