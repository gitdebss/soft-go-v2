import { Link } from "react-router-dom";

interface ILinkButtonProps {
  label: string;
  style: "primary" | "secondary" | "tertiary" | "disabled";
  size?: "default" | "compact";
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

// `compact` é para o botão aparecer ao lado de outro conteúdo numa linha, como
// na lista de passageiras, em vez de ocupar a largura toda.
const sizeMap: Record<string, string> = {
  default: "text-base py-2 px-3 h-12 w-full",
  compact: "text-sm py-1.5 px-3 h-9 w-auto shrink-0",
};

export const LinkButton = (props: ILinkButtonProps) => {
  const currentStyle = styleMap[props.style] || styleMap.primary;
  const currentSize = sizeMap[props.size ?? "default"];

  const className = `border-0 flex justify-center items-center gap-2 rounded-lg font-medium ${currentSize} ${currentStyle.bg} ${currentStyle.text} hover:opacity-80 transition-opacity`;

  return (
    <>
      {props.isRouterLink === true ? (
        <Link className={className} to={props.url}>
          {props.children}
          {props.label}
        </Link>
      ) : (
        <a className={className} href={props.url}>
          {props.children}
          {props.label}
        </a>
      )}
    </>
  );
};
