import { useState } from "react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Header } from "./components/Header";
import { FilterOptions } from "./models/FilterOptions";
import { MockRides } from "./models/MockRides";
import { Checkbox } from "./components/Checkbox";

function App() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <>
      <Header></Header>
      <main className="p-4 gap-4 grid">
        <Button
          label="Vou pra Soft"
          type="button"
          style="primary"
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        ></Button>

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
          <Card {...ride}></Card>
        ))}
        </ul>
      </main>
    </>
  );
}

export default App;
