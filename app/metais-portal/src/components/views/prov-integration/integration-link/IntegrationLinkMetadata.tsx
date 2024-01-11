import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FindAll311200 } from '@isdd/metais-common/api/generated/iam-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { PO } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Props = {
    createdByIdentityData: FindAll311200 | undefined
    lastModifiedByIdentityData: FindAll311200 | undefined
    gestorData: RoleParticipantUI[] | undefined
    ciItemData: ConfigurationItemUi | undefined
}

export const IntegrationLinkMetadata: React.FC<Props> = ({ createdByIdentityData, lastModifiedByIdentityData, gestorData, ciItemData }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const isLoggedIn = !!user
    const gestorEntity = gestorData?.[0].configurationItemUi

    return (
        <DefinitionList>
            <InformationGridRow
                label={t('integrationLinks.createdAt')}
                value={t('dateTime', { date: ciItemData?.metaAttributes?.createdAt })}
                tooltip={t('integrationLinks.createdAt')}
            />
            {isLoggedIn && (
                <InformationGridRow
                    label={t('integrationLinks.createdBy')}
                    value={Array.isArray(createdByIdentityData) ? createdByIdentityData[0].displayName : createdByIdentityData?.displayName}
                    tooltip={t('integrationLinks.createdBy')}
                />
            )}

            <InformationGridRow
                label={t('integrationLinks.gestor')}
                value={
                    <Link to={`/ci/${PO}/${gestorEntity?.uuid}`} target="_blank">
                        {gestorEntity?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                    </Link>
                }
                tooltip={t('integrationLinks.gestor')}
            />
            <InformationGridRow
                label={t('integrationLinks.lastModifiedAt')}
                value={t('dateTime', { date: ciItemData?.metaAttributes?.lastModifiedAt })}
                tooltip={t('integrationLinks.lastModifiedAt')}
            />
            {isLoggedIn && (
                <InformationGridRow
                    label={t('integrationLinks.lastModifiedBy')}
                    value={
                        Array.isArray(lastModifiedByIdentityData)
                            ? lastModifiedByIdentityData[0].displayName
                            : lastModifiedByIdentityData?.displayName
                    }
                    tooltip={t('integrationLinks.lastModifiedBy')}
                />
            )}
        </DefinitionList>
    )
}
