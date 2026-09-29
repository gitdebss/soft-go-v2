interface ICheckboxProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}

const styleMap = {
  active: {
    bg: "bg-primary-default",
    text: "text-on-primary",
    border: "border-0",
  },
  inactive: {
    bg: "bg-surface-primary",
    text: "text-text-primary",
    border: "border-border-default",
  },
};

export const Checkbox = (props: ICheckboxProps) => {
  const currentStyle = props.checked ? styleMap.active : styleMap.inactive;

  return (
    <label
      className={`pt-2 pb-2 pr-4 pl-4 rounded-4xl w-fit cursor-pointer
        has-focus-visible:ring-2 has-focus-visible:ring-primary-default has-focus-visible:ring-offset-2
        ${currentStyle.bg}
        ${currentStyle.text}
        border
        ${currentStyle.border}`}
    >
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        className="sr-only"
      />

      {props.label}
    </label>
  );
};
