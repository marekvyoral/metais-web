import React from 'react'
import { useTranslation } from 'react-i18next'
import { GET_ENUM, QueryFeedback } from '@isdd/metais-common/index'
import { ConfigurationItemUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'

import { RelationAttribute } from '@/components/entities/cards/RelationAttribute'

interface ConfigurationItemHistoryDetail {
    data?: ConfigurationItemUi
    roleParticipant?: RoleParticipantUI
    isLoading: boolean
    isError: boolean
}

export const ConfigurationItemHistoryDetailView: React.FC<ConfigurationItemHistoryDetail> = ({ data, roleParticipant, isLoading, isError }) => {
    const { t } = useTranslation()
    const { data: sources, isLoading: isLoadingSources, isError: isErrorSources } = useGetEnum(GET_ENUM.ZDROJ)

    const metaAtributes = data?.metaAttributes
    return (
        <QueryFeedback loading={isLoading || isLoadingSources} error={isError || isErrorSources} withChildren>
            <DefinitionList>
                <RelationAttribute
                    name={t('historyTab.configurationItemView.state')}
                    value={t(`metaAttributes.state.${metaAtributes?.state ?? ''}`)}
                />
                <RelationAttribute
                    name={t('historyTab.configurationItemView.owner')}
                    value={roleParticipant?.configurationItemUi?.attributes?.Gen_Profil_nazov}
                />
                <RelationAttribute name={t('historyTab.configurationItemView.createdBy')} value={metaAtributes?.createdBy} />
                <RelationAttribute name={t('historyTab.configurationItemView.createdAt')} value={t('dateTime', { date: metaAtributes?.createdAt })} />
                <RelationAttribute name={t('historyTab.configurationItemView.lastModifiedBy')} value={metaAtributes?.lastModifiedBy} />
                <RelationAttribute
                    name={t('historyTab.configurationItemView.lastModifiedAt')}
                    value={t('dateTime', { date: metaAtributes?.lastModifiedAt })}
                />
                <RelationAttribute
                    name={t('historyTab.configurationItemView.source')}
                    value={sources?.enumItems?.find((en) => en.code === data?.attributes?.Gen_Profil_zdroj)?.value}
                />
            </DefinitionList>
        </QueryFeedback>
    )
}
