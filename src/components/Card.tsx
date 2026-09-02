import { Clock, MapPin, MessageCircleMore, Users } from "lucide-react";
import type { IRide } from "../models/IRide";
import { getInitials } from "../utils/getInitials";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Avatar } from "./Avatar";

const transportLabels: Record<IRide["transportType"], string> = {
  uber: "Uber",
  car: "Carro",
  bus: "Ônibus",
};

export const Card = (ride: IRide) => {

  const badgeProps = { label: transportLabels[ride.transportType], style: ride.transportType };

  return (
    <li
      className="flex flex-col shadow-default border border-border-default rounded-xl p-5 bg-surface-primary  gap-4"
      key={ride.id}
    >
      <div className="flex flex-row justify-between">
        <div className="flex items-center flex-row gap-3">
          <Avatar initials={getInitials(ride.name)} />
          <p className="font-bold text-black text-base">{ride.name}</p>
        </div>
        <Badge {...badgeProps}></Badge>
      </div>

      <div className="gap-3 flex flex-col">
        <div className="flex flex-row gap-2 items-center text-sm">
          <MapPin className="h-4 w-4" />
          <p>
            Saindo de <b>{ride.city}</b>
          </p>
          <p className="inline text-primary-default">• {ride.region}</p>
        </div>

        <div className="flex flex-row items-center text-sm justify-between">
          <div className="flex gap-2">
            <Clock className="h-4 w-4" />
            <p>
              {ride.date.replaceAll("-", "/")} às {ride.hour}
            </p>
          </div>
          <div className="flex gap-2">
            <Users className="h-4 w-4 inline" />
            <p>
              {ride.occupiedSpots}/{ride.totalSpots} Vagas
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {ride.phone && (
          <Button
            label="WhatsApp"
            type="button"
            style="tertiary"
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          >
            <MessageCircleMore className="text-success"/>
          </Button>
          )}

          <Button
            label="Vou junto"
            type="button"
            style="primary"
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          ></Button>
        </div>
      </div>
    </li>
  );
};
