import React from 'react'
import { useTranslation } from 'react-i18next'

import { StepperArrayEnum } from './Stepper'

interface IStepperSubtitle {
    title: string
    setSectionArray: React.Dispatch<React.SetStateAction<StepperArrayEnum[]>>
    sectionArray: number[]
}

export const StepperSubtitle: React.FC<IStepperSubtitle> = ({ title, setSectionArray, sectionArray }) => {
    const { t } = useTranslation()

    const filteredArray = sectionArray.filter((item) => item !== StepperArrayEnum.IGNORE)
    const isWholeArrayExpanded = filteredArray.every((item) => item === StepperArrayEnum.EXPANDED)

    const handleOpenAll = () => {
        if (filteredArray.includes(StepperArrayEnum.CLOSED)) {
            setSectionArray(sectionArray.map((item) => (item === StepperArrayEnum.IGNORE ? item : StepperArrayEnum.EXPANDED)))
        }
        if (isWholeArrayExpanded) {
            setSectionArray(sectionArray.map((item) => (item === StepperArrayEnum.IGNORE ? item : StepperArrayEnum.CLOSED)))
        }
    }

    return (
        <div className="idsk-stepper__subtitle-container">
            <div className="idsk-stepper__subtitle--heading govuk-grid-column-three-quarters">
                {title ?? <h3 className="govuk-heading-m idsk-stepper__section-subtitle">{title}</h3>}
            </div>

            <div
                className="idsk-stepper__controls govuk-grid-column-one-quarter"
                data-line1={t('stepper.openAll')}
                data-line2={t('stepper.closeAll')}
            >
                <button onClick={handleOpenAll} type="button" className="idsk-stepper__open-all" aria-expanded={isWholeArrayExpanded ? false : true}>
                    {isWholeArrayExpanded ? t('stepper.closeAll') : t('stepper.openAll')}
                    <span className="govuk-visually-hidden">{t('stepper.sections')}</span>
                </button>
            </div>
        </div>
    )
}
