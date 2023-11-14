import React, { useEffect } from 'react'

import { StepperArrayEnum } from './Stepper'

interface IStepperSectionTitle {
    title: string
    index: number
    sectionArray: number[]
    setSectionArray: React.Dispatch<React.SetStateAction<StepperArrayEnum[]>>
}

export const StepperSectionTitle: React.FC<IStepperSectionTitle> = ({ title, setSectionArray, index, sectionArray }) => {
    useEffect(() => {
        if (sectionArray.at(index) !== StepperArrayEnum.IGNORE) {
            const updatedArray = [...sectionArray]
            updatedArray[index] = StepperArrayEnum.IGNORE
            setSectionArray(updatedArray)
        }
    }, [index, sectionArray, setSectionArray])

    return (
        <div className="idsk-stepper__section-title">
            <div className="idsk-stepper__section-header idsk-stepper__section-subtitle">
                <p className="govuk-heading-m">{title}</p>
            </div>
        </div>
    )
}
