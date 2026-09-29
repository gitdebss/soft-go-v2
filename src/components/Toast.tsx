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
    // "success"/"warning"/"error" não são roles ARIA válidas - um valor
    // desconhecido em `role` faz o leitor de tela ignorar a live region do
    // <output> e nunca anunciar o toast sozinho. "alert" para erro é
    // assertivo (interrompe), "status" cobre os outros dois casos, polido.
    const role = props.type === "error" ? "alert" : "status"

    return (
        <output className={`p-4 border rounded-xl absolute top-0 w-full m-4 z-10 shadow-default ${className}`} role={role} aria-atomic="true">
            <h3>{props.title}</h3>
            <p>{props.message}</p>
        </output>
    )
}