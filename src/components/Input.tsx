import type { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | null;
  hideLabel?: boolean;
  helpText?: string;
  error?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const Input = (props: IInputProps) => {
  return (
    <div className="w-full">
      {props.label && (
        <label
          htmlFor={props.name}
          className={
            props.hideLabel
              ? "sr-only"
              : "block mb-1 text-sm font-medium text-text-secondary"
          }
        >
          {props.label}{" "}
          {props.required && <span className="text-red-700">*</span>}{" "}
        </label>
      )}

      <input
        {...props}
        className="pr-4 pl-4 pt-3.5 pb-3.5 border border-border-default text-text-tertiary bg-surface-primary rounded-xl w-full"
      />

      {props.error && (
        <p className="mt-1 text-sm text-red-700">{props.error}</p>
      )}
      {props.helpText && (
        <p className="mt-1 text-sm text-text-secondary">{props.helpText}</p>
      )}
    </div>
  );
};
