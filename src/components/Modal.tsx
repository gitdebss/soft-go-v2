import { CircleCheckBig, X } from "lucide-react";
import type { IRide } from "../models/IRide";
import { getInitials } from "../utils/getInitials";
import { Button } from "./Button";
import { Input } from "./Input";
import { Line } from "./Line";
import type { CreateUserRide } from "../models/dto/CreateUserRide";
import { UserRideService } from "../services/UserRideService";
import toast from "react-hot-toast";

interface IModalProps {
  ride: IRide;
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const userRideService = new UserRideService()

export const Modal = (props: IModalProps) => {
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
          <p>Preencha seus dados para avisar que você vai nessa carona.</p>
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
        <form className="grid gap-5" onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const userRide: CreateUserRide = {
                name: String(formData.get('name')),
                phone: String(formData.get('phone'))
            }
            userRideService.createUserRide(userRide, props.ride.id).then(() => {
              toast.success('Passageiro adicionado a corrida com sucesso!')
              props.onClose()
              props.onSubmit()
            }).catch((error) => {
              console.error(error)
              toast.error('Erro ao adicionar passageiro a corrida.')
            })
        }}>
          <Input
            label="Seu nome"
            name="name"
            type="text"
            placeholder="João da Silva"
            required={true}
          />
          <Input
            label="WhatsApp"
            name="phone"
            type="text"
            placeholder="(11) 99999-9999"
            required={false}
          />
          <Button type="submit" label="Confirmar Presença" style="primary">
            <CircleCheckBig />
          </Button>

          <Button type="button" label="Cancelar" style="secondary" />
        </form>
      </div>
    </dialog>
  );
};
