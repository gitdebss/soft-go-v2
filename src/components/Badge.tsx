interface IBadgeProps {
  label: string;
  style: number;
  // Contexto que só existe visualmente pela posição/cor do badge; leitor de
  // tela precisa dele por extenso para não anunciar só "Carro" sem dizer do
  // quê. Vira texto `sr-only` em vez de `aria-label`: um <span> sem role
  // próprio (role implícito "generic") não garante que o nome acessível via
  // aria-label seja lido em modo de navegação contínua - texto real, sim.
  context?: string;
}

const styleMap: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-suport-1", text: "text-on-suport-1" },
  2: { bg: "bg-suport-2", text: "text-on-suport-2" },
  3: { bg: "bg-suport-3", text: "text-on-suport-3" },
};

export const Badge = (props: IBadgeProps) => {
  const currentStyle = styleMap[props.style] || styleMap[1];

  return (
      <span
        className={`pr-2.5 pl-2.5 pt-1 pb-1 rounded-md w-fit h-fit flex items-center ${currentStyle.bg} ${currentStyle.text} text-sm font-bold`}
      >
        {props.context ? (
          <>
            <span aria-hidden="true">{props.label}</span>
            <span className="sr-only">
              {props.context}: {props.label}
            </span>
          </>
        ) : (
          props.label
        )}
      </span>
  );
};
