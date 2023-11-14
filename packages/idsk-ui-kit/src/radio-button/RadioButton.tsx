import classNames from 'classnames'
import React, { DetailedHTMLProps, forwardRef } from 'react'

interface IRadioButtonProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    name: string
    value: string | number
    disabled?: boolean
    className?: string
    label: string
}

export const RadioButton = forwardRef<HTMLInputElement, IRadioButtonProps>(({ id, label, name, disabled, value, className, ...rest }, ref) => {
    return (
        <div className={classNames('govuk-radios__item', className)}>
            <input className="govuk-radios__input" id={id} name={name} type="radio" value={value} disabled={disabled} ref={ref} {...rest} />
            <label className="govuk-label govuk-radios__label" htmlFor={id}>
                {label}
            </label>
        </div>
    )
})
