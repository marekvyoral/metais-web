import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConfigurationItemUi, QueryFeedback, RoleParticipantUI } from '@isdd/metais-common/index'

import { CardColumnList } from '@/components/entities/cards/CardColumnList'
import { RelationAttribute } from '@/components/entities/cards/RelationAttribute'

interface ConfigurationItemHistoryDetail {
    data?: ConfigurationItemUi
    roleParticipant?: RoleParticipantUI
    isLoading: boolean
    isError: boolean
}

export const ConfigurationItemHistoryDetailView: React.FC<ConfigurationItemHistoryDetail> = ({ data, roleParticipant, isLoading, isError }) => {
    const { t } = useTranslation()

    const metaAtributes = data?.metaAttributes
    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <CardColumnList>
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
                <RelationAttribute name={t('historyTab.configurationItemView.source')} value={data?.attributes?.Gen_Profil_zdroj} />
            </CardColumnList>
        </QueryFeedback>
    )
}
