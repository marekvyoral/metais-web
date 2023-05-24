import classnames from 'classnames'
import React from 'react'

interface IButton {
    label: string
    disabled?: boolean
    variant?: 'secondary' | 'warning'
    onClick?: () => void
    type?: 'button' | 'reset' | 'submit'
}

export const Button: React.FC<IButton> = ({ label, onClick, variant, disabled, type = 'button' }) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className={classnames({
                'idsk-button': true,
                'idsk-button--disabled': disabled,
                'idsk-button--secondary': variant === 'secondary',
                'idsk-button--warning': variant === 'warning',
            })}
            disabled={disabled}
            aria-disabled={disabled}
            data-module="idsk-button"
        >
            {label}
        </button>
    )
}
