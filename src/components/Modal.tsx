import { CircleCheckBig, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { IRide } from "../models/IRide";
import { getInitials } from "../utils/getInitials";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./Button";
import { Line } from "./Line";
import { UserRideService } from "../services/UserRideService";

interface IModalProps {
  ride: IRide;
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const userRideService = new UserRideService();

// Formata só para exibir: o valor armazenado é sempre de dígitos (AD-002).
function formatPhone(phone?: string | null): string | null {
  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");

  if (digits.length !== 11) return phone;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export const Modal = (props: IModalProps) => {
  const { user } = useAuth();

  const handleConfirm = async () => {
    try {
      await userRideService.createUserRide(props.ride.id);
      toast.success("Presença confirmada nessa carona!");
      props.onClose();
      props.onSubmit();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Erro ao confirmar presença.")
        : "Erro ao confirmar presença.";

      toast.error(message);
    }
  };

  const formattedPhone = formatPhone(user?.phone);

  return (
    <dialog
      className={
        props.open
          ? `fixed top-0 bottom-0 h-full w-full flex items-center justify-center backdrop-blur bg-black/40 z-30`
          : `sr-only`
      }
      open
    >
      <div className="bg-surface-primary p-6 z-50 grid gap-5 rounded-2xl m-4">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <h2 className="font-bold text-xl">Quero ir junto!</h2>
            <button
              className="border-none w-fit h-fit flex items-center bg-none"
              type="button"
              onClick={props.onClose}
            >
              <X />
            </button>
          </div>
          <p>Confirme sua presença nessa carona com os dados da sua conta.</p>
        </div>
        <Line />
        <div className="flex row items-center gap-3 bg-surface-secondary border-2 border-border-default rounded-xl p-3">
          <span className="rounded-full w-8 h-8 flex items-center justify-center bg-primary-default text-on-primary">
            {getInitials(props.ride.name)}
          </span>
          <div className="grid">
            <p>
              <b>{props.ride.name}</b> • {props.ride.hour}
            </p>
            <p>
              Saindo de {props.ride.city}
              <b className="text-primary-default font-light">
                • {props.ride.occupiedSpots}/{props.ride.totalSpots} Vagas{" "}
              </b>
            </p>
          </div>
        </div>

        <div className="grid gap-1 bg-surface-secondary border-2 border-border-default rounded-xl p-3">
          <p className="text-text-tertiary text-sm">Você vai como</p>
          <p className="font-bold">{user?.name}</p>
          <p className="text-sm">
            {formattedPhone ?? "Telefone não informado"}
          </p>
        </div>

        <Button
          type="button"
          label="Confirmar Presença"
          style="primary"
          onClick={handleConfirm}
        >
          <CircleCheckBig />
        </Button>

        <Button
          type="button"
          label="Cancelar"
          style="secondary"
          onClick={props.onClose}
        />
      </div>
    </dialog>
  );
};
