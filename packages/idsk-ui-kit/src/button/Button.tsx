import classnames from 'classnames'
import React, { DetailedHTMLProps, MouseEventHandler, ReactNode, forwardRef } from 'react'

import styles from './styles.module.scss'
interface IButton extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    label: ReactNode
    disabled?: boolean
    variant?: 'secondary' | 'warning'
    onClick?: (() => void) | MouseEventHandler<HTMLElement>
    onFocus?: () => void
    type?: 'button' | 'reset' | 'submit'
    className?: string
    value?: string
    id?: string
    bottomMargin?: boolean
    autoFocus?: boolean
}

export const Button = forwardRef<HTMLButtonElement, IButton>(
    ({ label, onClick, variant, disabled, type = 'button', className, value, id, onFocus, bottomMargin = true, autoFocus, ...rest }, ref) => {
        return (
            <button
                autoFocus={autoFocus}
                id={id}
                value={value}
                ref={ref}
                onClick={onClick}
                onFocus={onFocus}
                type={type}
                className={classnames(
                    className,
                    {
                        'idsk-button': true,
                        'idsk-button--disabled': disabled,
                        'idsk-button--secondary': variant === 'secondary',
                        'idsk-button--warning': variant === 'warning',
                    },
                    !bottomMargin && styles.marginBottom0,
                )}
                disabled={disabled}
                aria-disabled={disabled}
                data-module="idsk-button"
                {...rest}
            >
                {label}
            </button>
        )
    },
)
