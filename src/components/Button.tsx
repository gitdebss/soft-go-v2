interface IButtonProps{
    label: string,
    type: 'submit' | 'reset' | 'button',
    style: 'primary' | 'secondary' | 'tertiary' | 'disabled',
    disabled?: boolean,
    children?: React.ReactNode,
    onClick:  () => void
}

const styleMap: Record<string, { bg: string; text: string }> = {
        primary: { bg: 'bg-primary-default', text: 'text-on-primary' },
        secondary: { bg: 'bg-surface-primary', text: 'text-primary-default' },
        tertiary: { bg: 'bg-surface-tertiary', text: 'text-text-primary' },
        disabled: { bg: 'bg-surface-secondary', text: 'text-text-disable' },
    };

export const Button = (props: IButtonProps) => {

    const currentStyle = styleMap[props.style] || styleMap.primary;
    
    return (
        <button type={props.type} className={`border-0 flex justify-center items-center gap-2 rounded-lg text-base py-2 px-3 h-12 font-medium w-full ${currentStyle.bg} ${currentStyle.text} hover:opacity-80 transition-opacity`} onClick={props.onClick} disabled={props.disabled || props.style === 'disabled'}>
            {props.children}
            {props.label}
        </button>
    );
}