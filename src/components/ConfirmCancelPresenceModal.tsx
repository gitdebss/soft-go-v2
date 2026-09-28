import { TriangleAlert, X } from "lucide-react";
import { format } from "date-fns";
import type { IRide } from "../models/IRide";
import { Button } from "./Button";
import { Line } from "./Line";

interface IConfirmCancelPresenceModalProps {
  ride: IRide;
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Mesmo padrão do ConfirmCancelRideModal: componente próprio em vez de
// reusar o Modal de presença, que tem o formulário de embarque embutido.
export const ConfirmCancelPresenceModal = (props: IConfirmCancelPresenceModalProps) => {
  return (
    <dialog
      className={
        props.open
          ? `fixed top-0 bottom-0 h-full w-full flex items-center justify-center backdrop-blur bg-black/40 z-30`
          : `sr-only`
      }
      open
    >
      <div className="bg-surface-primary p-6 z-50 grid gap-5 rounded-2xl m-4 max-w-md">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <h2 className="font-bold text-xl">Cancelar presença</h2>
            <button
              className="border-none w-fit h-fit flex items-center bg-none"
              type="button"
              aria-label="Fechar"
              onClick={props.onClose}
            >
              <X />
            </button>
          </div>
          <p>
            Sua presença na carona de{" "}
            <b>
              {format(new Date(`${props.ride.date}T00:00:00`), "dd/MM/yyyy")} às{" "}
              {props.ride.hour}
            </b>
            , saindo de <b>{props.ride.city}</b>.
          </p>
        </div>

        <Line />

        <div className="flex gap-3 items-start bg-surface-secondary border-2 border-border-default rounded-xl p-3">
          <TriangleAlert className="h-5 w-5 shrink-0 text-suport-3" />
          <p className="text-sm">
            Você libera sua vaga para outra pessoa. Se mudar de ideia, pode
            confirmar presença de novo, se ainda houver vaga.
          </p>
        </div>

        <Button
          type="button"
          label="Sim, cancelar presença"
          style="danger"
          disabled={props.isSubmitting}
          onClick={props.onConfirm}
        >
          <TriangleAlert />
        </Button>

        <Button
          type="button"
          label="Voltar"
          style="secondary"
          onClick={props.onClose}
        />
      </div>
    </dialog>
  );
};
