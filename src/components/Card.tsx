import { ChevronDown, ChevronUp, Clock, MapPin, MessageCircleMore, Users } from "lucide-react";
import { useState } from "react";
import { getInitials } from "../utils/getInitials";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Avatar } from "./Avatar";
import { format } from "date-fns";
import { LinkButton } from "./LinkButton";
import type { IRide } from "../models/IRide";
import type { IUserRide } from "../models/IUserRide";
import { UserRideService } from "../services/UserRideService";
import { PassengerList } from "./PassengerList";

interface ICardProps{
  ride: IRide,
  onOpenModal: (ride:IRide) => void
}

// O backend já informa a relação da usuária logada com a carona, então o card
// mostra o estado antes do clique em vez de só errar depois dele.
function confirmationButtonState(ride: IRide): { label: string; disabled: boolean } {
  if (ride.isOwner) return { label: "Sua carona", disabled: true };
  if (ride.alreadyJoined) return { label: "Você já vai nessa carona", disabled: true };
  if (ride.availableSpots === 0) return { label: "Vou junto", disabled: true };

  return { label: "Vou junto", disabled: false };
}

const userRideService = new UserRideService();

export const Card = (props: ICardProps) => {
  const ride = props.ride

  const badgeProps = { label: ride.transportType.name, style: ride.transportType.id };
  const confirmationButton = confirmationButtonState(ride);

  const [showPassengers, setShowPassengers] = useState(false);
  const [passengers, setPassengers] = useState<IUserRide[]>([]);
  const [isLoadingPassengers, setIsLoadingPassengers] = useState(false);
  const [passengersError, setPassengersError] = useState<string | undefined>();
  const [hasFetchedPassengers, setHasFetchedPassengers] = useState(false);

  // Busca sob demanda e uma vez só: carregar as passageiras de toda carona ao
  // montar o mural seria uma requisição por card.
  const handleTogglePassengers = async () => {
    const willOpen = !showPassengers;
    setShowPassengers(willOpen);

    if (!willOpen || hasFetchedPassengers) return;

    setIsLoadingPassengers(true);
    setPassengersError(undefined);

    try {
      const response = await userRideService.getUsersByRideId(ride.id);
      setPassengers(response.data);
      setHasFetchedPassengers(true);
    } catch {
      setPassengersError("Erro ao carregar passageiras.");
    } finally {
      setIsLoadingPassengers(false);
    }
  };

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
          { ride.complement && <p className="inline text-primary-default">• {ride.complement}</p>}{''}
        </div>

        <div className="flex flex-row items-center text-sm justify-between">
          <div className="flex gap-2">
            <Clock className="h-4 w-4" />
            <p>
              {format(new Date(`${ride.date}T00:00:00`), 'dd/MM/yyyy')} às {ride.hour}
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
          <LinkButton
            label="WhatsApp"
            style="tertiary"
            url={`https://wa.me/55${ride.phone}?text=Ol%C3%A1!%20Publiquei%20uma%20corrida%20no%20soft-go!%20Gostaria%20de%20ir%20comigo%3F%F0%9F%98%8A`}
          >
            <MessageCircleMore className="text-success"/>
          </LinkButton>
          )}

          <Button
            label={confirmationButton.label}
            type="button"
            style="primary"
            onClick={() => props.onOpenModal(ride)}
            disabled={confirmationButton.disabled}
          ></Button>
        </div>

        {ride.isOwner && (
          <div className="grid gap-3 border-t border-border-default pt-3">
            <button
              type="button"
              aria-expanded={showPassengers}
              onClick={handleTogglePassengers}
              className="flex items-center justify-between text-sm text-primary-default font-medium"
            >
              Ver passageiras
              {showPassengers ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showPassengers && (
              <PassengerList
                passengers={passengers}
                isLoading={isLoadingPassengers}
                error={passengersError}
              />
            )}
          </div>
        )}
      </div>
    </li>
  );
};
