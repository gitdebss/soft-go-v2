interface IButtonProps{
    label: string,
    type: 'submit' | 'reset' | 'button',
    style: 'primary' | 'secondary' | 'tertiary' | 'disabled',
    onClick(): void
}

const styleMap: Record<string, { bg: string; text: string }> = {
        primary: { bg: 'primary-default', text: 'text-on-primary' },
        secondary: { bg: 'surface-primary', text: 'primary-default' },
        tertiary: { bg: 'surface-tertiary', text: 'text-primary' },
        disabled: { bg: 'surface-secondary', text: 'text-disable' },
    };

export const Button = (props: IButtonProps) => {

    const currentStyle = styleMap[props.style] || styleMap.primary;
    
    return (
        <button type={props.type} className={`border-0 rounded-lg text-base py-2 px-3 h-12 uppercase font-medium w-full bg-${currentStyle.bg} text-${currentStyle.text} hover:opacity-80 transition-opacity`} onClick={props.onClick}>
            {props.label}
        </button>
    );
}