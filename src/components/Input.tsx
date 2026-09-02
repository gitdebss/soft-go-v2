interface IInputProps {
  label: string | null;
  type: string;
  name: string;
  placeholder: string;
  required: boolean;
  helpText?: string;
}

export const Input = (props: IInputProps) => {
  return (
    <div className="w-full">
      {props.label && (
        <label
          htmlFor={props.name}
          className="block mb-1 text-sm font-medium text-text-secondary"
        >
          {props.label}{" "}
          {props.required && <span className="text-red-700">*</span>}{" "}
        </label>
      )}

      {props.type === "textarea" ? (
        <textarea
          name={props.name}
          placeholder={props.placeholder}
          required={props.required}
          className="pr-4 pl-4 pt-3.5 pb-3.5 border border-border-default text-text-tertiary bg-surface-primary rounded-xl w-full resize-none"
        ></textarea>
      ) : (
        <input
          name={props.name}
          type={props.type}
          placeholder={props.placeholder}
          required={props.required}
          className="pr-4 pl-4 pt-3.5 pb-3.5 border border-border-default text-text-tertiary bg-surface-primary rounded-xl w-full"
        />
      )}
      {props.helpText && (
        <p className="mt-1 text-sm text-text-secondary">{props.helpText}</p>
      )}
    </div>
  );
};
