interface IAvatarProps {
  initials: string;
}

export const Avatar = ( props : IAvatarProps) => {
  return (
        // Decorativo: o nome completo já aparece em texto ao lado. Sem isso,
        // leitor de tela lê as iniciais como se fossem uma palavra à parte.
        <span
          aria-hidden="true"
          className="rounded-full w-10 h-10 shrink-0 flex items-center justify-center bg-surface-secondary text-primary-default border border-border-default font-bold text-base"
        >
          {props.initials}
        </span>
  );
};
