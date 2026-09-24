import { CalendarClock, MapPin, TextAlignStart, Van } from "lucide-react";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Line } from "../components/Line";
import { RadioVehicle } from "../components/RadioVehicle";
import type { CreateRide } from "../models/dto/CreateRide";
import { RideService } from "../services/RideService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { rideSchema, type RideFormData } from "../schemas/rideSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../components/Textarea";

function FormRide() {
  const rideService = new RideService();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Publicar carona exige conta: a dona da carona é a usuária autenticada.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const radioVehicleOptions = [
    { label: "Carro", value: 1 },
    { label: "Uber", value: 2 },
    { label: "Ônibus", value: 3 },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RideFormData>({
    resolver: zodResolver(rideSchema),
    mode: "onChange",
    defaultValues: {
      transportTypeId: 1,
    },
  });

  const handleFormSubmit = (data: RideFormData) => {
    const rideData: CreateRide = {
      ...data,
      complement: data.complement?.trim() || null,
      obs: data.obs?.trim() || null,
      transportTypeId: Number(data.transportTypeId),
      totalSpots: Number(data.totalSpots),
    };

    rideService
      .createRide(rideData)
      .then(() => {
        toast.success("Corrida criada com sucesso!");
        navigate("/");
      })
      .catch(() => {
        toast.error("Erro ao criar corrida");
      });
  };

  const selected = watch("transportTypeId");

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="p-4 gap-4 grid justify-self-center w-full max-w-2xl">
        <div className="gap-1 grid mt-1 mb-1">
          <h2 className="text-text-primary font-medium">Publicar no mural</h2>

          <p className="text-text-tertiary text-sm">
            Compartilhe sua viagem e conecte-se com colegas.
          </p>
        </div>

        <form
          className="p-4 gap-5 grid bg-surface-primary rounded-2xl w-full"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <section className="gap-4 grid">
            <div className="flex items-center text-text-secondary text-xl font-bold gap-2">
              <CalendarClock />
              <h3>Quando?</h3>
            </div>
            <Line />
            <Input
              label="Data"
              {...register("date")}
              type="date"
              placeholder="Selecione a data"
              required={true}
              error={errors.date?.message}
            />
            <Input
              {...register("hour")}
              label="Horário"
              type="time"
              placeholder="Selecione a hora"
              required={true}
              error={errors.hour?.message}
            />
          </section>
          <section className="gap-4 grid">
            <div className="flex items-center text-text-secondary text-xl font-bold gap-2">
              <MapPin />
              <h3>Onde?</h3>
            </div>
            <Line />
            <Input
              {...register("city")}
              label="Saindo de (cidade)"
              type="text"
              placeholder="Ex: São Paulo"
              required={true}
              error={errors.city?.message}
            />
            <Input
              {...register("complement")}
              label="Complemento (Bairro/Ponto)"
              type="text"
              placeholder="Ex: Metrô Vila Madereira"
              required={false}
              helpText="Opcional para facilitar o encontro."
              error={errors.complement?.message}
            />
          </section>
          <section className="gap-4 grid">
            <div className="flex items-center text-text-secondary text-xl font-bold gap-2">
              <Van />
              <h3>Como?</h3>
            </div>
            <Line />

            <label className="block mb-1 text-sm font-medium text-text-secondary">
              Tipo de Transporte
              <span className="text-red-700"> *</span>
            </label>
            <ul className="flex gap-3 justify-center">
              {radioVehicleOptions.map((option) => (
                <RadioVehicle
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  checked={selected === option.value}
                  onChange={() =>
                    setValue("transportTypeId", option.value, {
                      shouldValidate: true,
                    })
                  }
                />
              ))}
            </ul>
            {errors.transportTypeId && (
              <p className="mt-1 text-sm text-red-700">
                {errors.transportTypeId?.message}
              </p>
            )}
            <Input
              {...register("totalSpots", {
                valueAsNumber: true,
              })}
              label="Número de vagas"
              type="number"
              placeholder="Ex: 4"
              required={true}
              error={errors.totalSpots?.message}
            />
          </section>
          <section className="gap-4 grid">
            <div className="flex items-center text-text-secondary text-xl font-bold gap-2">
              <TextAlignStart />
              <h3>Detalhes</h3>
            </div>
            <Line />
            <Textarea
              {...register("obs")}
              label="Observação"
              placeholder="Ex: Vou passar na padaria antes, dividimos pedágio..."
              required={false}
              error={errors.obs?.message}
            />
          </section>
          <Button label="Publicar Viagem" type="submit" style="primary" />
        </form>
      </main>
    </>
  );
}

export default FormRide;
