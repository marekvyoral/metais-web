import { useTranslation } from 'react-i18next'
import React from 'react'

import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'

type AriaSctionErrorListType = {
    section: ISection
}

export const AriaSectionErrorList = ({ section }: AriaSctionErrorListType) => {
    const { t } = useTranslation()
    return (
        <>
            <span className="govuk-visually-hidden">{t('sectionErrors')}</span>
            <ul>
                {section.errorMessages?.map((msg, index) => (
                    <li key={`${section.id}_${index}`} className="govuk-visually-hidden">
                        <span>{`${msg.errorTitle} - ${msg.errorMessage}`}</span>
                    </li>
                ))}
            </ul>
        </>
    )
}
