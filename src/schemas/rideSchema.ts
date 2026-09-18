import { z } from "zod";

export const rideSchema = z.object({
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
    .min(3, "A cidade deve ter pelo menos 3 caracteres"),

  complement: z.string().optional(),

  transportTypeId: z
    .number()
    .min(1, "Selecione um tipo de transporte"),

  totalSpots: z
    .number()
    .min(1, "Deve haver pelo menos 1 vaga"),

  obs: z.string().optional(),

  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  phone: z.string().optional(),
});

export type RideFormData = z.infer<typeof rideSchema>;