import { TriangleAlert, X } from "lucide-react";
import { format } from "date-fns";
import type { IRide } from "../models/IRide";
import { Button } from "./Button";
import { Line } from "./Line";

interface IConfirmCancelRideModalProps {
  ride: IRide;
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Confirmação própria em vez de reusar o Modal de presença, que tem o
// formulário de embarque embutido. Cancelar não tem volta, então o clique no
// card não chama o endpoint direto.
export const ConfirmCancelRideModal = (props: IConfirmCancelRideModalProps) => {
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
            <h2 className="font-bold text-xl">Cancelar carona</h2>
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
            Sua carona de{" "}
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
            Não dá para desfazer. Se alguém já confirmou presença, a carona fica
            no mural avisando que não vai mais acontecer, e você continua com a
            lista de passageiras para falar com cada uma.
          </p>
        </div>

        <Button
          type="button"
          label="Sim, cancelar carona"
          style="primary"
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
