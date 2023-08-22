import classnames from 'classnames'
import React, { ReactNode, forwardRef } from 'react'

interface IButton {
    label: ReactNode
    disabled?: boolean
    variant?: 'secondary' | 'warning'
    onClick?: () => void
    type?: 'button' | 'reset' | 'submit'
    className?: string
    value?: string
    id?: string
}

export const Button = forwardRef<HTMLButtonElement, IButton>(({ label, onClick, variant, disabled, type = 'button', className, value, id }, ref) => {
    return (
        <button
            id={id}
            value={value}
            ref={ref}
            onClick={onClick}
            type={type}
            className={classnames(
                {
                    'idsk-button': true,
                    'idsk-button--disabled': disabled,
                    'idsk-button--secondary': variant === 'secondary',
                    'idsk-button--warning': variant === 'warning',
                },
                className,
            )}
            disabled={disabled}
            aria-disabled={disabled}
            data-module="idsk-button"
        >
            {label}
        </button>
    )
})
