import React from 'react'

interface IRadioButtonProps {
  label: string
  name: string
  value?: string
}

export const RadioButton: React.FunctionComponent<IRadioButtonProps> = ({ label, name }) => {
  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend">{label}</legend>
        <div className="govuk-radios govuk-radios--inline">
          <div className="govuk-radios__item">
            <input className="govuk-radios__input" id="example-1" name={name} type="radio" value="yes" />
            <label className="govuk-label govuk-radios__label">Áno</label>
          </div>
          <div className="govuk-radios__item">
            <input className="govuk-radios__input" id="example-1-2" name={name} type="radio" value="no" />
            <label className="govuk-label govuk-radios__label">Nie</label>
          </div>
        </div>
      </fieldset>
    </div>
  )
}
