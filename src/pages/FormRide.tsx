import {
  CalendarClock,
  Clock,
  MapPin,
  TextAlignStart,
  Van,
} from "lucide-react";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Line } from "../components/Line";

function FormRide() {
  return (
    <>
      <Header />
      <main className="p-4 gap-4 grid">
        <h2 className="text-text-primary text-md font-semibold">
          Publicar no mural
        </h2>
        <p className="text-text-tertiary">
          Compartilhe sua viagem e conecte-se com colegas.
        </p>
        <form className="p-4 gap-5 grid bg-surface-primary rounded-2xl">
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
            />
            <Input
              label="Horário"
              name="time"
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
              name="origin"
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
            <Input
              label="Número de vagas"
              name="seats"
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
              name="observation"
              type="text"
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
          <Button
            label="Publicar Viagem"
            type="submit"
            style="primary"
            onClick={() => {}}
          />
        </form>
      </main>
    </>
  );
}

export default FormRide;
