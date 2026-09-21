import { Bus, CarFront, CarTaxiFront, type LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
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

const transportIcons: Record<string, LucideIcon> = {
  1: CarFront,
  2: CarTaxiFront,
  3: Bus,
};

export const RadioVehicle = ({label, value, ...props}: ICheckboxProps) => {
  const Icon = transportIcons[value] || (() => null);
  const currentStyle = props.checked ? styleMap.checked : styleMap.unchecked;

  return (
    <label
      className={`p-3 h-20 rounded-xl w-full max-w-25 cursor-pointer flex items-center justify-center gap-2 text-base font-medium transition-all flex-col bg-surface-primary
        ${currentStyle.text}
        border
        ${currentStyle.border}`}
    >
      <input
        {...props}
        type="radio"
        value={value}
        className="sr-only"
      />
      {Icon && <Icon className="h-6 w-6" />}

      <p className="text-sm font-medium">{label}</p>
    </label>
  );
};
