import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "O nome é obrigatório")
      .max(100, "O nome deve ter no máximo 100 caracteres"),

    email: z.string().min(1, "O e-mail é obrigatório").email("Informe um e-mail válido"),

    // password/confirmPassword are validated against their trimmed length but
    // never trimmed themselves: `.trim()` is a transform, and zodResolver
    // submits the parsed (transformed) value, not what the user typed. If
    // signup silently trimmed the password before hashing while login (and
    // the backend) never trims, a password with meaningful leading/trailing
    // whitespace would lock the user out. `.refine` validates without
    // mutating.
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .refine((value) => value.trim().length > 0, { message: "A senha é obrigatória" }),

    confirmPassword: z
      .string()
      .min(1, "A confirmação de senha é obrigatória")
      .refine((value) => value.trim().length > 0, {
        message: "A confirmação de senha é obrigatória",
      }),

    // Telefone é opcional: quem não informar simplesmente não exibe botão de
    // WhatsApp. A validação ignora como a usuária formatou o número (com ou
    // sem parênteses, espaço, traço) e checa só os dígitos: DDD (2) + 9 +
    // mais 8 dígitos. A limpeza para dígitos puros (AD-002) acontece depois,
    // no submit (SignUp.tsx) e de novo no backend - aqui só validamos.
    phone: z
      .string()
      .transform((value) => value.trim())
      .refine(
        (value) => value === "" || /^\d{2}9\d{8}$/.test(value.replace(/\D/g, "")),
        "Informe um celular válido. Ex: (51) 99999-9999",
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
