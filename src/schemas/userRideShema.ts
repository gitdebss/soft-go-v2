import { z } from "zod";

export const userRideSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  phone: z.string()
    .transform((value) => value.trim())
    .refine(
      (value) => value === "" || /^\(\d{2}\) \d{5}-\d{4}$/.test(value),
      "Informe um celular válido. Ex: (51) 99999-9999"
    ),
});

export type UserRideFormData = z.infer<typeof userRideSchema>;