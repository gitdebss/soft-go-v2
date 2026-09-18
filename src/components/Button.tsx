interface IButtonProps{
    label: string,
    type: 'submit' | 'reset' | 'button',
    style: 'primary' | 'secondary' | 'tertiary' | 'disabled',
    disabled?: boolean,
    children?: React.ReactNode,
    onClick?:  () => void
}

const styleMap: Record<string, { styleClass: string }> = {
        primary: { styleClass: 'bg-primary-default text-on-primary' },
        secondary: { styleClass: 'bg-surface-primary text-primary-default' },
        tertiary: { styleClass: 'bg-surface-tertiary text-text-primary' },
        disabled: { styleClass: 'bg-surface-tertiary text-text-disable cursor-not-allowed' },
    };

export const Button = (props: IButtonProps) => {

    const currentStyle = styleMap[props.style] || styleMap.primary;
    
    return (
        <button type={props.type} className={`border-0 flex justify-center items-center gap-2 rounded-lg text-base py-2 px-3 h-12 font-medium w-full ${ props.disabled ? styleMap.disabled : currentStyle.styleClass} hover:opacity-80 transition-opacity`} onClick={props.onClick} disabled={props.disabled || props.style === 'disabled'}>
            {props.children}
            {props.label}
        </button>
    );
}