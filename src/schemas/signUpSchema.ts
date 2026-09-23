import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "O nome é obrigatório")
      .max(100, "O nome deve ter no máximo 100 caracteres"),

    email: z.string().min(1, "O e-mail é obrigatório").email("Informe um e-mail válido"),

    password: z
      .string()
      .trim()
      .min(8, "A senha deve ter pelo menos 8 caracteres"),

    confirmPassword: z.string().trim().min(1, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
