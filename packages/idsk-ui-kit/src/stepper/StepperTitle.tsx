import React from 'react'

interface IStepperSectionTitle {
    title: string
}

export const StepperSectionTitle: React.FC<IStepperSectionTitle> = ({ title }) => {
    return (
        <div className="idsk-stepper__section-title">
            <div className="idsk-stepper__section-header idsk-stepper__section-subtitle">
                <p className="govuk-heading-m">{title}</p>
            </div>
        </div>
    )
}
