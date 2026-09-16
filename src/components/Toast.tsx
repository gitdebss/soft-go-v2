interface IToastProps{
    type: 'success'  | 'warning' | 'error';
    title: string;
    message: string;
}

const styleMap: Record<string, { class: string }> = {
  success: { class: "class-suport-1" },
  warning: { class: "class-suport-2" },
  error: { class: "class-suport-3" },
};

export const Toast = (props: IToastProps) => {
    const className = styleMap[props.type].class

    return (
        <output className={`p-4 border rounded-xl absolute top-0 w-full m-4 z-10 shadow-default ${className}`} role={props.type}>
            <h3>{props.title}</h3>
            <p>{props.message}</p>
        </output>
    )
}