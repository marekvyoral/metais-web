import React from 'react'
import { useTranslation } from 'react-i18next'

import { ISection } from './StepperSection'

interface IStepperSubtitle {
    title: string
    stepperList: ISection[]
    openOrCloseAllSections: () => void
}

export const StepperSubtitle: React.FC<IStepperSubtitle> = ({ title, stepperList, openOrCloseAllSections }) => {
    const { t } = useTranslation()
    const isWholeArrayExpanded = stepperList.every((item) => item.isOpen)

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
                <button onClick={openOrCloseAllSections} type="button" className="idsk-stepper__open-all" aria-expanded={isWholeArrayExpanded}>
                    {isWholeArrayExpanded ? t('stepper.closeAll') : t('stepper.openAll')}
                    <span className="govuk-visually-hidden">{t('stepper.sections')}</span>
                </button>
            </div>
        </div>
    )
}
