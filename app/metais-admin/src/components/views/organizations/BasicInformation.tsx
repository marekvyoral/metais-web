import { useTranslation } from 'react-i18next'
import React from 'react'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'

import { IOrganizationDetail } from '@/components/containers/organizations/OrganizationsDetailContainer'

export const BasicInformation = ({ parsedAttributes }: IOrganizationDetail) => {
    const { t } = useTranslation()

    return (
        <DefinitionList>
            {parsedAttributes?.map((attribute) => (
                <InformationGridRow key={attribute.label + attribute?.value} label={t(attribute.label)} value={attribute?.value} />
            ))}
        </DefinitionList>
    )
}
