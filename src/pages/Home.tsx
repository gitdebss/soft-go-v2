import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { FilterOptions } from "../models/FilterOptions";
import { Checkbox } from "../components/Checkbox";
import { Card } from "../components/Card";
import { isValid, parse } from "date-fns";
import { LinkButton } from "../components/LinkButton";
import { RideService } from "../services/RideService";
import type { IRide } from "../models/IRide";

function Home() {
  const rideService = new RideService()
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();

  const [rides, setRides] = useState<IRide[]>([]); 

  async function loadRides() {
    const data = await rideService.loadRides()
    setRides(data)
  }

  useEffect(() => {
    loadRides();
  }, []);

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
              setError("Data inválida. Por favor, insira uma data válida.");
            } else {
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
                  if (chip.value === "all") return ["all"];

                  const newSelected = prev.includes(chip.value)
                    ? prev.filter((item) => item !== chip.value)
                    : [...prev.filter((item) => item !== "all"), chip.value];

                  return newSelected;
                });
              }}
            />
          ))}
        </ul>

        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rides.map((ride) => (
            <Card {...ride} key={ride.id}></Card>
          ))}
        </ul>
      </main>
    </>
  );
}

export default Home;
