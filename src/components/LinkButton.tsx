import { Link } from "react-router-dom";

interface ILinkButtonProps {
  label: string;
  style: "primary" | "secondary" | "tertiary" | "disabled";
  children?: React.ReactNode;
  isRouterLink?: boolean;
  url: string;
}

const styleMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary-default", text: "text-on-primary" },
  secondary: { bg: "bg-surface-primary", text: "text-primary-default" },
  tertiary: { bg: "bg-surface-tertiary", text: "text-text-primary" },
  disabled: { bg: "bg-surface-secondary", text: "text-text-disable" },
};

export const LinkButton = (props: ILinkButtonProps) => {
  const currentStyle = styleMap[props.style] || styleMap.primary;

  return (
    <>
      {props.isRouterLink === true ? (
        <Link
          className={`border-0 flex justify-center items-center gap-2 rounded-lg text-base py-2 px-3 h-12 font-medium w-full ${currentStyle.bg} ${currentStyle.text} hover:opacity-80 transition-opacity`}
          to={props.url}
        >
          {props.children}
          {props.label}
        </Link>
      ) : (
        <a
          className={`border-0 flex justify-center items-center gap-2 rounded-lg text-base py-2 px-3 h-12 font-medium w-full ${currentStyle.bg} ${currentStyle.text} hover:opacity-80 transition-opacity`}
          href={props.url}
        >
          {props.children}
          {props.label}
        </a>
      )}
    </>
  );
};
