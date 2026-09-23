import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { signInSchema, type SignInFormData } from "../schemas/signInSchema";

// SPEC_DEVIATION: design.md lists `Card.tsx` as a reuse for this page's form
// container, but `src/components/Card.tsx` is the ride-listing card (props:
// `ride`, `onOpenModal`) - not a generic layout wrapper, so it cannot wrap a
// form. The container below matches the visual pattern already used in
// `FormRide.tsx`'s card-style wrapper div instead (same as SignUp.tsx).
// Reason: literal reuse of `Card.tsx` is not applicable; this keeps the same
// look and feel without repurposing a ride-specific component.

const GENERIC_ERROR_MESSAGE = "E-mail ou senha inválidos";

function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [signInError, setSignInError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: SignInFormData) => {
    setSignInError(null);
    try {
      await signIn(data);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSignInError(error.response?.data?.message ?? GENERIC_ERROR_MESSAGE);
        return;
      }

      setSignInError(GENERIC_ERROR_MESSAGE);
    }
  };

  return (
    <main className="p-4 gap-4 grid justify-self-center w-full max-w-md min-h-screen items-center">
      <div className="p-4 gap-5 grid bg-surface-primary rounded-2xl w-full border border-border-default">
        <div className="gap-1 grid mt-1 mb-1">
          <h2 className="text-text-primary font-medium text-xl">Entrar</h2>
          <p className="text-text-tertiary text-sm">
            Acesse sua conta para publicar e participar de corridas.
          </p>
        </div>

        <form
          className="gap-4 grid"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
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
            {...register("password")}
            id="password"
            label="Senha"
            type="password"
            placeholder="Sua senha"
            required
            error={errors.password?.message}
          />

          {signInError && (
            <p className="text-sm text-red-700">{signInError}</p>
          )}

          <Button label="Entrar" type="submit" style="primary" />
        </form>

        <p className="text-sm text-text-tertiary text-center">
          Não tem conta?{" "}
          <Link className="text-primary-default font-medium" to="/sign-up">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}

export default SignIn;
