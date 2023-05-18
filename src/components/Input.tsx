import React from 'react'

interface IInputProps {
    label: string
    name: string
    value?: string
    onChange?: (value: string) => void
}

export const Input: React.FunctionComponent<IInputProps> = ({ label, name, value, onChange }) => {
    return (
        <div className="govuk-form-group">
            <label className="govuk-label">{label}</label>
            <input
                className="govuk-input"
                id={`input_name_${name}`}
                name={name}
                type="text"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
            />
        </div>
    )
}
