import classNames from 'classnames'
import React, { DetailedHTMLProps, forwardRef } from 'react'

interface ICheckBoxProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    label: string
    name: string
    value: string
    disabled?: boolean
    labelClassName?: string
    containerClassName?: string
}

export const CheckBox = forwardRef<HTMLInputElement, ICheckBoxProps>(
    ({ id, label, name, disabled, value, labelClassName, containerClassName, className, ...rest }, ref) => {
        return (
            <div className={classNames('govuk-checkboxes__item', containerClassName)}>
                <input
                    className={classNames('govuk-checkboxes__input', className)}
                    id={id}
                    name={name}
                    type="checkbox"
                    value={value}
                    disabled={disabled}
                    ref={ref}
                    {...rest}
                />
                <label className={classNames('govuk-label govuk-checkboxes__label', labelClassName)} htmlFor={id}>
                    {label}
                </label>
            </div>
        )
    },
)
