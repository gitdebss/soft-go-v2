import { ChevronDown, ChevronUp, CircleOff, Clock, MapPin, MessageCircleMore, Trash2, Users } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getInitials } from "../utils/getInitials";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Avatar } from "./Avatar";
import { format } from "date-fns";
import { LinkButton } from "./LinkButton";
import type { IRide } from "../models/IRide";
import type { IUserRide } from "../models/IUserRide";
import { UserRideService } from "../services/UserRideService";
import { RideService } from "../services/RideService";
import { PassengerList } from "./PassengerList";
import { ConfirmCancelRideModal } from "./ConfirmCancelRideModal";

interface ICardProps{
  ride: IRide,
  onOpenModal: (ride:IRide) => void,
  onCanceled: () => void
}

// O backend já informa a relação da usuária logada com a carona, então o card
// mostra o estado antes do clique em vez de só errar depois dele.
// A dona não chega aqui: o bloco de ações inteiro não é renderizado para ela.
function confirmationButtonState(ride: IRide): { label: string; disabled: boolean } {
  if (ride.alreadyJoined) return { label: "Você já vai nessa carona", disabled: true };
  if (ride.availableSpots === 0) return { label: "Vou junto", disabled: true };

  return { label: "Vou junto", disabled: false };
}

const userRideService = new UserRideService();
const rideService = new RideService();

export const Card = (props: ICardProps) => {
  const ride = props.ride

  const badgeProps = { label: ride.transportType.name, style: ride.transportType.id };
  const confirmationButton = confirmationButtonState(ride);
  const isCanceled = ride.status === "canceled";

  const [showPassengers, setShowPassengers] = useState(false);
  const [passengers, setPassengers] = useState<IUserRide[]>([]);
  const [isLoadingPassengers, setIsLoadingPassengers] = useState(false);
  const [passengersError, setPassengersError] = useState<string | undefined>();
  const [hasFetchedPassengers, setHasFetchedPassengers] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // O backend decide o desfecho pela contagem de passageiras, então o retorno
  // para a dona muda conforme ele: uma carona que continua no mural pede que
  // ela avise quem estava indo.
  const handleCancelRide = async () => {
    setIsCanceling(true);

    try {
      const response = await rideService.cancelRide(ride.id);

      toast.success(
        response.data.status === "canceled"
          ? "Carona cancelada. Avise quem já tinha confirmado presença!"
          : "Carona removida do mural.",
      );
      setIsConfirmingCancel(false);
      props.onCanceled();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Erro ao cancelar a carona.")
        : "Erro ao cancelar a carona.";

      toast.error(message);
    } finally {
      setIsCanceling(false);
    }
  };

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
    // `grayscale` apaga as cores do badge de transporte e do avatar sem
    // precisar de uma variante "cancelada" dentro de cada componente filho.
    <li
      className={`md:relative flex flex-col shadow-default border border-border-default rounded-xl p-5 gap-4 ${
        isCanceled ? "bg-surface-tertiary grayscale" : "bg-surface-primary"
      }`}
      key={ride.id}
    >
      <div className="flex flex-row justify-between">
        <div className="flex items-center flex-row gap-3">
          <Avatar initials={getInitials(ride.name)} />
          <p className="font-bold text-black text-base">{ride.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge {...badgeProps}></Badge>

          {/* Estado terminal: uma carona já cancelada não oferece a ação de
              novo, e o backend responderia 409. */}
          {ride.isOwner && !isCanceled && (
            <button
              type="button"
              aria-label="Cancelar carona"
              title="Cancelar carona"
              onClick={() => setIsConfirmingCancel(true)}
              className="h-8 w-8 shrink-0 rounded-full border-0 flex items-center justify-center bg-surface-tertiary text-text-secondary hover:bg-surface-secondary hover:text-red-700 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
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

        {/* Sem canal de notificação no app, o card é como quem confirmou
            presença descobre que a carona caiu. */}
        {isCanceled && (
          <div className="flex gap-2 items-center rounded-lg bg-surface-secondary border border-border-default p-3">
            <CircleOff className="h-4 w-4 shrink-0 text-text-secondary" />
            <p className="text-sm font-medium text-text-secondary">
              Essa corrida não vai mais acontecer :(
            </p>
          </div>
        )}

        {/* Na própria carona não há ação a oferecer: contatar a si mesma não faz
            sentido e confirmar presença é recusado pelo backend. Em carona
            cancelada não há o que confirmar nem o que combinar. */}
        {!ride.isOwner && !isCanceled && (
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
        )}

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

            {/* No mobile a lista abre dentro do card, que é coluna única. A
                partir de `md` o mural vira grade, e crescer aqui esticaria a
                linha inteira: a lista passa a flutuar sob o card. */}
            {showPassengers && (
              <div className="md:absolute md:left-0 md:right-0 md:top-full md:z-20 md:mt-2 md:max-h-72 md:overflow-y-auto md:rounded-xl md:border md:border-border-default md:bg-surface-primary md:p-4 md:shadow-default">
                <PassengerList
                  passengers={passengers}
                  isLoading={isLoadingPassengers}
                  error={passengersError}
                />
              </div>
            )}

          </div>
        )}
      </div>

      {isConfirmingCancel && (
        <ConfirmCancelRideModal
          ride={ride}
          open={isConfirmingCancel}
          isSubmitting={isCanceling}
          onClose={() => setIsConfirmingCancel(false)}
          onConfirm={handleCancelRide}
        />
      )}
    </li>
  );
};
