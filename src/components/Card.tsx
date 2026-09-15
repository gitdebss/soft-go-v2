import { Clock, MapPin, MessageCircleMore, Users } from "lucide-react";
import type { IRide } from "../models/IRide";
import { getInitials } from "../utils/getInitials";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Avatar } from "./Avatar";
import { format } from "date-fns";
import { LinkButton } from "./LinkButton";

export const Card = (ride: IRide) => {

  const badgeProps = { label: ride.transportType.name, style: ride.transportType.id };

  return (
    <li
      className="flex flex-col shadow-default border border-border-default rounded-xl p-5 bg-surface-primary gap-4"
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
          <p className="inline text-primary-default">• {ride.complement}</p>
        </div>

        <div className="flex flex-row items-center text-sm justify-between">
          <div className="flex gap-2">
            <Clock className="h-4 w-4" />
            <p>
              {format(ride.date,'dd/MM/yyyy')} às {ride.hour}
            </p>
          </div>
          <div className="flex gap-2">
            <Users className="h-4 w-4 inline" />
            <p>
              {ride.occupiedSpots}/{ride.total_spots} Vagas
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {ride.phone && (
          <LinkButton
            label="WhatsApp"
            style="tertiary"
            url=''
          >
            <MessageCircleMore className="text-success"/>
          </LinkButton>
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
