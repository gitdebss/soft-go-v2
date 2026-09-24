interface IAvatarProps {
  initials: string;
}

export const Avatar = ( props : IAvatarProps) => {
  return (
        <span className="rounded-full w-10 h-10 shrink-0 flex items-center justify-center bg-surface-secondary text-primary-default border border-border-default font-bold text-base">
          {props.initials}
        </span>
  );
};
