interface IInputProps {
  label: string | null;
  hideLabel?: boolean;
  type: string;
  name: string;
  placeholder: string;
  required: boolean;
  helpText?: string;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const Input = (props: IInputProps) => {
  return (
    <div className="w-full">
      {props.label && (
        <label
          htmlFor={props.name}
          className={props.hideLabel ? "sr-only" : "block mb-1 text-sm font-medium text-text-secondary"}
        >
          {props.label}{" "}
          {props.required && <span className="text-red-700">*</span>}{" "}
        </label>
      )}

      {props.type === "textarea" ? (
        <textarea
          id={props.name}
          name={props.name}
          placeholder={props.placeholder}
          required={props.required}
          onChange={props.onChange}
          className="pr-4 pl-4 pt-3.5 pb-3.5 border border-border-default text-text-tertiary bg-surface-primary rounded-xl w-full resize-none"
        ></textarea>
      ) : (
        <input
          id={props.name}
          name={props.name}
          type={props.type}
          placeholder={props.placeholder}
          required={props.required}
          onChange={props.onChange}
          className="pr-4 pl-4 pt-3.5 pb-3.5 border border-border-default text-text-tertiary bg-surface-primary rounded-xl w-full"
        />
      )}
      
      {props.error && (
        <p className="mt-1 text-sm text-red-700">{props.error}</p>
      )}
      {props.helpText && (
        <p className="mt-1 text-sm text-text-secondary">{props.helpText}</p>
      )}
    </div>
  );
};
