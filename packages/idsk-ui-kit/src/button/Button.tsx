import classnames from 'classnames'
import React, { ReactNode, forwardRef } from 'react'

interface IButton {
    label: ReactNode
    disabled?: boolean
    variant?: 'secondary' | 'warning'
    onClick?: () => void
    type?: 'button' | 'reset' | 'submit'
    className?: string
}

export const Button = forwardRef<HTMLButtonElement, IButton>(({ label, onClick, variant, disabled, type = 'button', className }, ref) => {
    return (
        <button
            ref={ref}
            onClick={onClick}
            type={type}
            className={classnames(className, {
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
})
