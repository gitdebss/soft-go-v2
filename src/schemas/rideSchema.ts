import { z } from "zod";
import { BUS_TRANSPORT_TYPE_ID } from "../models/ITransportRide";

const rideObjectSchema = z.object({
  date: z
    .string()
    .min(1, "A data é obrigatória")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const limit = new Date(today);
      limit.setFullYear(limit.getFullYear() + 1);

      return date >= today && date <= limit;
    }, "A data deve estar entre hoje e 1 ano a partir de hoje"),

  hour: z.string().min(1, "O horário é obrigatório"),

  city: z
    .string()
    .min(1, "A cidade é obrigatória")
    .min(3, "A cidade deve ter pelo menos 3 caracteres")
    .max(100, "A cidade deve ter no máximo 100 caracteres"),

  complement: z.string().optional(),

  transportTypeId: z
    .number()
    .min(1, "Selecione um tipo de transporte"),

  // Opcional no schema: obrigatório só é decidido no refine abaixo, porque
  // ônibus não tem vaga limitada e não exibe o campo.
  totalSpots: z.number().optional(),

  obs: z.string().optional(),
});

export const rideSchema = rideObjectSchema.refine(
  (data) =>
    data.transportTypeId === BUS_TRANSPORT_TYPE_ID ||
    (data.totalSpots !== undefined && data.totalSpots >= 1),
  {
    message: "Deve haver pelo menos 1 vaga",
    path: ["totalSpots"],
  },
);

export type RideFormData = z.infer<typeof rideObjectSchema>;