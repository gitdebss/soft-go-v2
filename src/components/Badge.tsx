interface IBadgeProps {
  label: string;
  style: number;
}

const styleMap: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-suport-1", text: "text-on-suport-1" },
  2: { bg: "bg-suport-2", text: "text-on-suport-2" },
  3: { bg: "bg-suport-3", text: "text-on-suport-3" },
};

export const Badge = (props: IBadgeProps) => {
  const currentStyle = styleMap[props.style] || styleMap[1];

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
