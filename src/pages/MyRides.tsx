import { useEffect, useState } from "react";
import { Plus, Road } from "lucide-react";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Checkbox } from "../components/Checkbox";
import { Card } from "../components/Card";
import { format, isValid, parse } from "date-fns";
import { LinkButton } from "../components/LinkButton";
import { RideService } from "../services/RideService";
import type { IRide } from "../models/IRide";
import { classifyRide } from "../utils/classifyRide";
import { MyRidesStatusFilterOptions } from "../models/MyRidesStatusFilterOptions";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DEFAULT_STATUSES = ["ativa"];

function MyRides() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const rideService = new RideService();

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(DEFAULT_STATUSES);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [dateError, setDateError] = useState<string | undefined>();
  const [rides, setRides] = useState<IRide[]>([]);

  const today = format(new Date(), "yyyy-MM-dd");

  // Ver as próprias corridas exige conta: são sempre corridas da usuária
  // autenticada, nunca de outra pessoa.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      const data = await rideService.loadMyRides(selectedDate);
      setRides(data);
    };

    load();
  }, [isAuthenticated, selectedDate]);

  // Filtro de status é só em memória: já veio tudo do backend (sem o corte
  // de data que o mural aplica), a categoria é derivada, não outra chamada.
  const visibleRides = rides.filter((ride) =>
    selectedStatuses.includes(classifyRide(ride, today)),
  );

  const toggleStatus = (value: string) => {
    setSelectedStatuses((prev) => {
      const next = prev.includes(value)
        ? prev.filter((status) => status !== value)
        : [...prev, value];

      // Desmarcar tudo não vira "todas": volta ao mesmo estado do carregamento
      // inicial, decisão da usuária.
      return next.length > 0 ? next : DEFAULT_STATUSES;
    });
  };

  return (
    <>
      <Header />
      <main className="p-4 gap-4 grid">
        <section className="rounded-xl bg-surface-tertiary p-5 flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-text-primary">Minhas Corridas</h2>
          <p className="text-sm text-text-secondary">
            Acompanhe as corridas que você publicou: o que ainda vai rolar, o
            que já aconteceu e o que foi cancelado.
          </p>
        </section>

        <LinkButton
          label="Vou pra Soft"
          style="primary"
          isRouterLink={true}
          url="/form-ride"
        >
          <Plus />
        </LinkButton>

        <Input
          label="Filtro por data"
          hideLabel={true}
          name="filter"
          type="date"
          placeholder="Filtrar por data"
          required={false}
          onChange={(e) => {
            const value = e.target.value;
            const date = parse(value, "yyyy-MM-dd", new Date());

            if (!isValid(date)) {
              setSelectedDate(undefined);
            } else {
              setSelectedDate(value);
              setDateError(undefined);
            }
          }}
          error={dateError}
        />

        <ul className="flex gap-3 md: justify-self-center">
          {MyRidesStatusFilterOptions.map((chip) => (
            <Checkbox
              key={chip.value}
              label={chip.label}
              value={chip.value}
              checked={selectedStatuses.includes(chip.value)}
              onChange={() => toggleStatus(chip.value)}
            />
          ))}
        </ul>

        {visibleRides.length === 0 ? (
          <div className="flex flex-col w-full justify-center h-full items-center pt-7 gap-4">
            <Road className="h-15 w-15 text-text-secondary" />
            <p className="font-semibold text-xl text-text-secondary">
              Nenhuma corrida encontrada.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {visibleRides.map((ride) => (
              <Card
                ride={ride}
                key={ride.id}
                onOpenModal={() => {}}
                onCanceled={() =>
                  rideService.loadMyRides(selectedDate).then(setRides)
                }
              ></Card>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default MyRides;
