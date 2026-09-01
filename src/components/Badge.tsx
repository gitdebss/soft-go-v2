interface IBadgeProps {
  label: string;
  style: string;
}

const styleMap: Record<string, { bg: string; text: string }> = {
  uber: { bg: "bg-suport-1", text: "text-on-suport-1" },
  car: { bg: "bg-suport-2", text: "text-on-suport-2" },
  bus: { bg: "bg-suport-3", text: "text-on-suport-3" },
};

export const Badge = (props: IBadgeProps) => {
  const currentStyle = styleMap[props.style] || styleMap.uber;

  return (
    <>
      <span
        className={`pr-2.5 pl-2.5 pt-1 pb-1 rounded-md w-fit h-fit flex items-center ${currentStyle.bg} ${currentStyle.text} text-sm font-bold`}
      >
        {props.label}
      </span>
    </>
  );
};
