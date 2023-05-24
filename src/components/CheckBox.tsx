import React, { forwardRef } from 'react'

interface ICheckBoxProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    label: string
    name: string
    value: string
    disabled?: boolean
}

export const CheckBox = forwardRef<HTMLInputElement, ICheckBoxProps>(({ id, label, name, disabled, value, ...rest }, ref) => {
    return (
        <div className="govuk-checkboxes__item">
            <input className="govuk-checkboxes__input" id={id} name={name} type="checkbox" value={value} disabled={disabled} ref={ref} {...rest} />
            <label className="govuk-label govuk-checkboxes__label" htmlFor={id}>
                {label}
            </label>
        </div>
    )
})
