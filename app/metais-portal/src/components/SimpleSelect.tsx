import classNames from 'classnames'
import React, { DetailedHTMLProps, forwardRef } from 'react'

interface SelectProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    id: string
    label: string
    options: { value: string; label: string; disabled?: boolean }[]
    disabled?: boolean
}

export const SimpleSelect = forwardRef<HTMLSelectElement, SelectProps>(({ id, label, options, disabled = false, className, ...rest }, ref) => {
    return (
        <div className={classNames('govuk-form-group', className)}>
            <label className="govuk-label" htmlFor={id}>
                {label}
            </label>
            <select className="govuk-select" id={id} ref={ref} {...rest} disabled={disabled}>
                {options.map((item) => (
                    <option value={item.value} key={item.value} disabled={item.disabled}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    )
})
