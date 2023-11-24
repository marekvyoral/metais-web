import { TextBody, TextLink } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './subHeading.module.scss'

interface Props {
    entityName: string
    entityId: string
    currentName: string
    ciType?: string
}

export const SubHeading: React.FC<Props> = ({ entityName, entityId, currentName, ciType }) => {
    const { t } = useTranslation()
    return (
        <div className={styles.subHeading}>
            <TextBody>
                <strong>{t('ciType.chosenObject')} </strong>
            </TextBody>
            <TextBody>
                <TextLink to={`/ci/${entityName}/${entityId}`}>
                    {currentName ? `${currentName} ${ciType ? `(${ciType})` : ''}` : t('breadcrumbs.noName')}
                </TextLink>
            </TextBody>
        </div>
    )
}
