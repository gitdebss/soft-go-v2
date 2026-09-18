import { z } from "zod";

export const userRideSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  phone: z.string().optional(),
});

export type UserRideFormData = z.infer<typeof userRideSchema>;