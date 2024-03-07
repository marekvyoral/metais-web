import React from 'react'
import { useTranslation } from 'react-i18next'

import { ISection } from './StepperSection'

type Props = {
    section: ISection
}

export const StepperSectionErrorBlock: React.FC<Props> = ({ section }) => {
    const { t } = useTranslation()
    return (
        <>
            <h3>{`${t('stepper.sectionTitle')} ${section.title}`}</h3>
            <ul>
                {section.errorMessages?.map((msg, index) => (
                    <li key={`${section.id}_${index}`}>
                        <span>{`${msg.errorTitle} - ${msg.errorMessage}`}</span>
                    </li>
                ))}
            </ul>
        </>
    )
}
