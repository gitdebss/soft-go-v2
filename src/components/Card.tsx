import { Clock, MapPin } from "lucide-react";
import type { IRide } from "../models/IRide";
import { getInitials } from "../utils/getInitials";
import { Button } from "./Button";

interface ICardProps{
  ride: IRide,
}

export const Card = ( {ride}: ICardProps) => {
  return (
    <li className="flex flex-col shadow-default border border-border rounded-xl p-5 bg-container-bg  gap-3" key={ride.id}>
      <div className="flex flex-row justify-between">
        <div className="flex items-center flex-row gap-3">
        <span className="rounded-full w-10 h-10 flex items-center justify-center bg-bg text-accent-bg border border-border font-bold text-base">
          {getInitials(ride.name)}
        </span>
        <p className="font-bold text-black text-base">{ride.name}</p>
        </div>
      </div>

      <div className="gap-2 flex flex-col">
        <div className="flex flex-row gap-2 items-center text-sm">
          <span>
            <MapPin className="h-4 w-4" />
          </span>
          <p>
            Saindo de <b>{ride.city}</b>
          </p>
        </div>

        <div className="flex flex-row gap-2 items-center text-sm">
          <span>
            <Clock className="h-4 w-4" />
          </span>
          <p>
            {ride.date.replaceAll("-", "/")} às {ride.hour}
          </p>
        </div>

        <Button label="WhatsApp" type="button" style="tertiary" onClick={function (): void {
                  throw new Error("Function not implemented.");
              } }></Button>
        
        <Button label="Vou junto" type="button" style="primary" onClick={function (): void {
                  throw new Error("Function not implemented.");
              } }></Button>
      </div>
    </li>
  );
};
