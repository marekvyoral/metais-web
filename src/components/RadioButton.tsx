import React, { forwardRef } from 'react'

interface IRadioButtonProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    label: string
    name: string
    value: string
    disabled?: boolean
}

export const RadioButton = forwardRef<HTMLInputElement, IRadioButtonProps>(({ id, label, name, disabled, value, ...rest }, ref) => {
    return (
        <div className="govuk-radios__item">
            <input className="govuk-radios__input" id={id} name={name} type="radio" value={value} disabled={disabled} ref={ref} {...rest} />
            <label className="govuk-label govuk-radios__label" htmlFor={id}>
                {label}
            </label>
        </div>
    )
})
