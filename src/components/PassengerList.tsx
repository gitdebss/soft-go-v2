import { MessageCircleMore } from "lucide-react";
import type { IUserRide } from "../models/IUserRide";
import { Avatar } from "./Avatar";
import { LinkButton } from "./LinkButton";
import { getInitials } from "../utils/getInitials";

interface IPassengerListProps {
  passengers: IUserRide[];
  isLoading: boolean;
  error?: string;
}

const WHATSAPP_MESSAGE =
  "Ol%C3%A1!%20Sou%20da%20carona%20que%20voc%C3%AA%20confirmou%20presen%C3%A7a%20no%20soft-go!";

export const PassengerList = (props: IPassengerListProps) => {
  if (props.isLoading) {
    return <p className="text-sm text-text-tertiary">Carregando passageiras...</p>;
  }

  if (props.error) {
    return <p className="text-sm text-error">{props.error}</p>;
  }

  if (props.passengers.length === 0) {
    return (
      <p className="text-sm text-text-tertiary">Ninguém confirmou presença ainda</p>
    );
  }

  return (
    <ul className="grid gap-3">
      {props.passengers.map((passenger) => (
        <li key={passenger.id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar initials={getInitials(passenger.name)} />
            <p className="text-sm truncate">{passenger.name}</p>
          </div>

          {passenger.phone ? (
            <LinkButton
              label="WhatsApp"
              style="tertiary"
              size="compact"
              url={`https://wa.me/55${passenger.phone}?text=${WHATSAPP_MESSAGE}`}
            >
              <MessageCircleMore className="text-success h-4 w-4" />
            </LinkButton>
          ) : (
            <p className="text-sm text-text-tertiary shrink-0">
              Telefone não informado
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};
