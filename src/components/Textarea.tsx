import type { TextareaHTMLAttributes } from "react";

interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string | null;
  hideLabel?: boolean;
  helpText?: string;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLTextAreaElement>) => void;
}

export const Textarea = (props: ITextareaProps) => {
  // Mesmo motivo do Input: sem um `id` no controle, o `htmlFor` não associa nada.
  const controlId = props.id ?? props.name;

  return (
    <div className="w-full">
      {props.label && (
        <label
          htmlFor={controlId}
          className={props.hideLabel ? "sr-only" : "block mb-1 text-sm font-medium text-text-secondary"}
        >
          {props.label}{" "}
          {props.required && <span className="text-red-700">*</span>}{" "}
        </label>
      )}

        <textarea
          {...props}
          id={controlId}
          className="pr-4 pl-4 pt-3.5 pb-3.5 border border-border-default text-text-tertiary bg-surface-primary rounded-xl w-full resize-none"
        ></textarea>
      
      {props.error && (
        <p className="mt-1 text-sm text-red-700">{props.error}</p>
      )}
      {props.helpText && (
        <p className="mt-1 text-sm text-text-secondary">{props.helpText}</p>
      )}
    </div>
  );
};
