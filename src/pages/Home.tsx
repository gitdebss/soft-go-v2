import { useState } from "react";
import { Plus } from "lucide-react";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { FilterOptions } from "../models/FilterOptions";
import { Checkbox } from "../components/Checkbox";
import { MockRides } from "../models/MockRides";
import { Card } from "../components/Card";
import { useNavigate } from "react-router-dom";

function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <main className="p-4 gap-4 grid">
        <Button
          label="Vou pra Soft"
          type="button"
          style="primary"
          onClick={() => { navigate("/form-ride") }}
        >
          <Plus />
        </Button>

        <Input 
          label={null}
          name='filter'
          type='date'
          placeholder="Filtrar por data"
          required={false}
        />

        <ul className="flex gap-3">
        {FilterOptions.map((chip) => (
          <Checkbox
            key={chip.label}
            label={chip.label}
            value={chip.value}
            checked={selected.includes(chip.label)}
            onChange={() => {
              setSelected((prev) =>
                prev.includes(chip.label)
                  ? prev.filter((item) => item !== chip.label)
                  : [...prev, chip.label]
              );
            }}
          />
        ))}
      </ul>

        <ul className="grid gap-3">
        {MockRides.map((ride) => (
          <Card {...ride} key={ride.id}/>
        ))}
        </ul>
      </main>
    </>
  );
}

export default Home;
