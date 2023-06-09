import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './basicInformationSection.module.scss'
import { InformationGridRow } from './InformationGridRow'

interface IBasicInformationSectionProps extends PropsWithChildren {
    codeMetaIS: string
    admin: React.ReactNode
    informationSystemName: string
    referenceIdentifier: React.ReactNode
    note: string
    description: string
}

export const BasicInformationSection: React.FC<IBasicInformationSectionProps> = ({
    admin,
    codeMetaIS,
    informationSystemName,
    referenceIdentifier,
    note,
    description,
}) => {
    const { t } = useTranslation()
    return (
        <>
            <div className={styles.attributeGridRowBox}>
                <InformationGridRow label={t('attributeProfileAccordion.admin')} value={admin} />
                <InformationGridRow label={t('attributeProfileAccordion.informationSystemName')} value={informationSystemName} />
                <InformationGridRow label={t('attributeProfileAccordion.codeMetaIS')} value={codeMetaIS} />
                <InformationGridRow label={t('attributeProfileAccordion.referenceIdentifier')} value={referenceIdentifier} />
                <InformationGridRow label={t('attributeProfileAccordion.note')} value={note} />
                <InformationGridRow label={t('attributeProfileAccordion.description')} value={description} />
            </div>
        </>
    )
}
