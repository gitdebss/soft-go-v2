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

// `label`, `hideLabel`, `helpText` e `error` são props deste componente, não
// atributos HTML. Ficam de fora do rest para não chegarem ao <input>, onde o
// React os rejeitaria com um warning de prop desconhecida. `required` continua
// no rest: além de ser lido aqui para o asterisco, é atributo válido.
export const Input = ({
  label,
  hideLabel,
  helpText,
  error,
  ...inputProps
}: IInputProps) => {
  // O `htmlFor` do label só associa se o controle tiver um `id` igual. Nem toda
  // página passa `id`, então ele é derivado do `name` quando falta - sem isso o
  // label não aponta para controle nenhum e leitores de tela não o anunciam.
  const controlId = inputProps.id ?? inputProps.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={controlId}
          className={
            hideLabel
              ? "sr-only"
              : "block mb-1 text-sm font-medium text-text-secondary"
          }
        >
          {label}{" "}
          {inputProps.required && <span className="text-red-700">*</span>}{" "}
        </label>
      )}

      <input
        {...inputProps}
        id={controlId}
        className="pr-4 pl-4 pt-3.5 pb-3.5 border border-border-default text-text-tertiary bg-surface-primary rounded-xl w-full"
      />

      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
      {helpText && (
        <p className="mt-1 text-sm text-text-secondary">{helpText}</p>
      )}
    </div>
  );
};
