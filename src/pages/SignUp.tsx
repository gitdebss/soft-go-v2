import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { signUpSchema, type SignUpFormData } from "../schemas/signUpSchema";

// SPEC_DEVIATION: design.md lists `Card.tsx` as a reuse for this page's form
// container, but `src/components/Card.tsx` is the ride-listing card (props:
// `ride`, `onOpenModal`) - not a generic layout wrapper, so it cannot wrap a
// form. The container below matches the visual pattern already used in
// `FormRide.tsx`'s card-style wrapper div instead.
// Reason: literal reuse of `Card.tsx` is not applicable; this keeps the same
// look and feel without repurposing a ride-specific component.

function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: SignUpFormData) => {
    try {
      const phoneDigits = data.phone?.replace(/\D/g, "");

      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: phoneDigits || undefined,
      });
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError("email", {
          type: "server",
          message: error.response.data?.message ?? "E-mail já cadastrado",
        });
        return;
      }

      toast.error("Erro ao criar conta");
    }
  };

  return (
    <main className="p-4 gap-4 grid justify-self-center w-full max-w-md min-h-screen items-center">
      <div className="p-4 gap-5 grid bg-surface-primary rounded-2xl w-full border border-border-default">
        <div className="gap-1 grid mt-1 mb-1">
          <h2 className="text-text-primary font-medium text-xl">
            Criar conta
          </h2>
          <p className="text-text-tertiary text-sm">
            Cadastre-se para publicar e participar de corridas.
          </p>
        </div>

        <form
          className="gap-4 grid"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          <Input
            {...register("name")}
            id="name"
            label="Nome"
            type="text"
            placeholder="Ex: João da Silva"
            required
            error={errors.name?.message}
          />
          <Input
            {...register("email")}
            id="email"
            label="E-mail"
            type="email"
            placeholder="Ex: joao@email.com"
            required
            error={errors.email?.message}
          />
          <Input
            {...register("phone")}
            id="phone"
            label="WhatsApp (opcional)"
            type="text"
            placeholder="Ex: (51) 99999-9999"
            required={false}
            error={errors.phone?.message}
          />
          <Input
            {...register("password")}
            id="password"
            label="Senha"
            type="password"
            placeholder="Mínimo 8 caracteres"
            required
            error={errors.password?.message}
          />
          <Input
            {...register("confirmPassword")}
            id="confirmPassword"
            label="Confirmar senha"
            type="password"
            placeholder="Repita a senha"
            required
            error={errors.confirmPassword?.message}
          />

          <Button label="Criar conta" type="submit" style="primary" />
        </form>

        <p className="text-sm text-text-tertiary text-center">
          Já tem conta?{" "}
          <Link className="text-primary-default font-medium" to="/login">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}

export default SignUp;
