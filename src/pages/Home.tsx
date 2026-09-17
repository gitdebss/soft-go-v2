import { useEffect, useState } from "react";
import { Plus, Road } from "lucide-react";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { FilterOptions } from "../models/FilterOptions";
import { Checkbox } from "../components/Checkbox";
import { Card } from "../components/Card";
import { isValid, parse } from "date-fns";
import { LinkButton } from "../components/LinkButton";
import { RideService } from "../services/RideService";
import type { IRide } from "../models/IRide";
import { Modal } from "../components/Modal";

function Home() {
  const rideService = new RideService();
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [error, setError] = useState<string | undefined>();

  const [rides, setRides] = useState<IRide[]>([]);
  const [openModal, setModal] = useState<false | true>(false);
  const [rideModal, setRideModal] = useState<IRide>();

  const loadRides = async () => {
    const filter = selected.filter(Boolean).join(",");

    const rides = await rideService.loadRides(
      filter || undefined,
      selectedDate,
    );
    setRides(rides);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await loadRides();
        console.log("Rides recebidas:", data);
      } catch (error) {
        console.error("Erro ao carregar rides:", error);
      }
    };

    load();
  }, [selected, selectedDate]);

  const handleOpenModal = (ride: IRide) => {
    setRideModal(ride);
    setModal(true);
  };

  return (
    <>
      <Header />
      <main className="p-4 gap-4 grid">
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
            const date = parse(e.target.value, "yyyy-MM-dd", new Date());
            if (!isValid(date)) {
              setSelectedDate(undefined)
            } else {
              setSelectedDate(String(date));
              setError(undefined);
            }
          }}
          error={error}
        />

        <ul className="flex gap-3 md: justify-self-center">
          {FilterOptions.map((chip) => (
            <Checkbox
              key={chip.label}
              label={chip.label}
              value={chip.value}
              checked={selected.includes(chip.value)}
              onChange={() => {
                setSelected((prev) => {
                  if (chip.value === "") {
                    return [""];
                  }

                  if (prev.includes(chip.value)) {
                    const newSelected = prev.filter(
                      (item) => item !== chip.value,
                    );

                    return newSelected.length > 0 ? newSelected : [""];
                  }

                  return [...prev.filter((item) => item !== ""), chip.value];
                });
              }}
            />
          ))}
        </ul>

        {
          (rides.length === 0) ? (
            <div className="flex flex-col w-full justify-center h-full items-center pt-7 gap-4">
              <Road className="h-15 w-15 text-text-secondary"/>
              <p className="font-semibold text-xl text-text-secondary">Ops! Ainda não há corridas disponíveis.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {rides.map((ride) => (
                <Card
                  ride={ride}
                  key={ride.id}
                  onOpenModal={() => handleOpenModal(ride)}
                ></Card>
              ))}
            </ul>
          )
        }
      </main>
      {rideModal && (
        <Modal
          ride={rideModal}
          open={openModal}
          onClose={() => setModal(false)}
          onSubmit={() => loadRides()}
        />
      )}
    </>
  );
}

export default Home;
