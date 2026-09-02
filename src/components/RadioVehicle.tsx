import { Bus, CarFront, CarTaxiFront } from "lucide-react";

interface ICheckboxProps {
  label: string;
  value: string;
  checked?: boolean;
  onChange: () => void;
}

const styleMap = {
  checked: {
    text: "text-primary-default",
    border: "border-primary-default",
  },
  unchecked: {
    text: "text-text-primary",
    border: "border-border-default",
  },
};

export const RadioVehicle = (props: ICheckboxProps) => {

  const currentStyle = props.checked ? styleMap.checked : styleMap.unchecked;

  return (
    <label
      className={`p-3 h-20 rounded-xl w-full max-w-25 cursor-pointer flex items-center justify-center gap-2 text-base font-medium transition-all flex-col bg-surface-primary
        ${currentStyle.text}
        border
        ${currentStyle.border}`}
    >
      <input
        name="transportType"
        value={props.value}
        type="radio"
        checked={props.checked}
        onChange={props.onChange}
        className="sr-only"
      />
      {props.value === "car" && <CarFront className="h-6 w-6" />}
      {props.value === "uber" && <CarTaxiFront className="h-6 w-6" />}
      {props.value === "bus" && <Bus className="h-6 w-6" />}

      <p className="text-sm font-medium">{props.label}</p>
    </label>
  );
};
