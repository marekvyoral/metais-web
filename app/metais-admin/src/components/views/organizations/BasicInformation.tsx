import { useTranslation } from 'react-i18next'
import React from 'react'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'

import styles from '@/components/views/egov/basicInformationSection.module.scss'
import { IOrganizationDetail } from '@/components/containers/organizations/OrganizationsDetailContainer'

export const BasicInformation = ({ parsedAttributes }: IOrganizationDetail) => {
    const { t } = useTranslation()

    return (
        <div className={styles.attributeGridRowBox}>
            {parsedAttributes?.map((attribute) => (
                <InformationGridRow key={attribute.label + attribute?.value} label={t(attribute.label)} value={attribute?.value} />
            ))}
        </div>
    )
}
