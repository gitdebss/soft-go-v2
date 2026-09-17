import { CalendarClock, MapPin, TextAlignStart, Van } from "lucide-react";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Line } from "../components/Line";
import { RadioVehicle } from "../components/RadioVehicle";
import { useState } from "react";
import { isAfter, isBefore, isValid, parse } from "date-fns";
import type { CreateRide } from "../models/dto/CreateRide";
import { RideService } from "../services/RideService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function FormRide() {
  const rideService = new RideService();
  const navigate = useNavigate()

  const radioVehicleOptions = [
    { label: "Carro", value: "1" },
    { label: "Uber", value: "2" },
    { label: "Ônibus", value: "3" },
  ];

  const [selected, setSelected] = useState<string>();
  const [error, setError] = useState<string | undefined>();

  return (
    <>
      <Header />
      <main className="p-4 gap-4 grid">
        <div className="gap-1 grid mt-1 mb-1">
          <h2 className="text-text-primary font-medium">Publicar no mural</h2>
          <p className="text-text-tertiary text-sm">
            Compartilhe sua viagem e conecte-se com colegas.
          </p>
        </div>

        <form
          className="p-4 gap-5 grid bg-surface-primary rounded-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const ride: CreateRide = {
              name: String(formData.get("name") || ""),
              date: String(formData.get("date") || ""),
              hour: String(formData.get("hour") || ""),
              city: String(formData.get("city") || ""),
              complement: String(formData.get("complement") || ""),
              transportTypeId: Number(formData.get("transportType") || ""),
              totalSpots: Number(formData.get("totalSpots") || ""),
              obs: String(formData.get("obs") || ""),
              phone: String(formData.get("phone") || ""),
            };
            rideService.createRide(ride)
              .then(() => {
                toast.success("Corrida criada com sucesso!");
                navigate('/')
              })
              .catch(() => {
                toast.error("Erro ao criar corrida");
              });
          }}
        >
          <section className="gap-4 grid">
            <div className="flex items-center text-text-secondary text-xl font-bold gap-2">
              <CalendarClock />
              <h3>Quando?</h3>
            </div>
            <Line />
            <Input
              label="Data"
              name="date"
              type="date"
              placeholder="Selecione a data"
              required={true}
              onChange={(e) => {
                const date = parse(e.target.value, "yyyy-MM-dd", new Date());
                const dateLimit = new Date();
                dateLimit.setFullYear(dateLimit.getFullYear() + 1);
                if (
                  !isValid(date) ||
                  isBefore(date, new Date()) ||
                  isAfter(date, dateLimit)
                ) {
                  setError("Data inválida. Por favor, insira uma data válida.");
                } else {
                  setError(undefined);
                }
              }}
              error={error}
            />
            <Input
              label="Horário"
              name="hour"
              type="time"
              placeholder="Selecione a hora"
              required={true}
            />
          </section>
          <section className="gap-4 grid">
            <div className="flex items-center text-text-secondary text-xl font-bold gap-2">
              <MapPin />
              <h3>Onde?</h3>
            </div>
            <Line />
            <Input
              label="Saindo de (cidade)"
              name="city"
              type="text"
              placeholder="Ex: São Paulo"
              required={true}
            />
            <Input
              label="Complemento (Bairro/Ponto)"
              name="region"
              type="text"
              placeholder="Ex: Metrô Vila Madereira"
              required={false}
              helpText="Opcional para facilitar o encontro."
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
            <ul className="flex gap-3">
              {radioVehicleOptions.map((option) => (
                <RadioVehicle
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  checked={selected === option.value}
                  onChange={() => {
                    setSelected((prev) =>
                      prev === option.value ? undefined : option.value,
                    );
                  }}
                />
              ))}
            </ul>
            <Input
              label="Número de vagas"
              name="totalSpots"
              type="number"
              placeholder="Ex: 4"
              required={true}
            />
          </section>
          <section className="gap-4 grid">
            <div className="flex items-center text-text-secondary text-xl font-bold gap-2">
              <TextAlignStart />
              <h3>Detalhes</h3>
            </div>
            <Line />
            <Input
              label="Observação"
              name="obs"
              type="textarea"
              placeholder="Ex: Vou passar na padaria antes, dividimos pedágio..."
              required={false}
            />
            <Line />
            <Input
              label="Seu nome"
              name="name"
              type="text"
              placeholder="Ex: João da Silva"
              required={true}
            />
            <Input
              label="WhatsApp"
              name="phone"
              type="text"
              placeholder="(11) 99999-9999"
              required={false}
            />
          </section>
          <Button label="Publicar Viagem" type="submit" style="primary" />
        </form>
      </main>
    </>
  );
}

export default FormRide;
