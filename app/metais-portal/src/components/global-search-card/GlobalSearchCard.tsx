import { Card } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
    ConfigurationItemElasticItem,
    DmsDocumentElasticItem,
    DmsDocumentElasticItemAllOfRefType,
    ElasticItemElasticItemType,
    ElasticItemHolderElasticItemsItem,
    MeetingRequestElasticItem,
    RelationshipElasticItem,
    RoleParticipantUI,
    StandardRequestElasticItem,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { GlobalCardDefinitionItem } from './GlobalCardDefinitionItem'

import { getOwnerInformation } from '@/componentHelpers/ci/ciTableHelpers'

interface GlobalSearchCardProps {
    cardData: ElasticItemHolderElasticItemsItem
    ownerItems?: RoleParticipantUI[]
}

export const GlobalSearchCard: React.FC<GlobalSearchCardProps> = ({ cardData, ownerItems }) => {
    const { t } = useTranslation()

    const getDocHref = (elasticItem: DmsDocumentElasticItem) => {
        switch (elasticItem.refType) {
            case DmsDocumentElasticItemAllOfRefType.CI:
                return `/ci/${elasticItem.refCiTechnicalName}/${elasticItem.refCiId}`
            case DmsDocumentElasticItemAllOfRefType.MEETING_REQUEST:
                return `${RouterRoutes.STANDARDIZATION_MEETINGS_LIST}/${elasticItem.refMeetingRequestId}`
            case DmsDocumentElasticItemAllOfRefType.STANDARD_REQUEST:
                return `${RouterRoutes.STANDARDIZATION_DRAFTS_LIST}/${elasticItem.refStandardRequestId}`
            case DmsDocumentElasticItemAllOfRefType.VOTE:
                return `${RouterRoutes.STANDARDIZATION_VOTE_LIST}/${elasticItem.refVoteId}`
            default:
                return ''
        }
    }

    const getCardParams = (
        item: ElasticItemHolderElasticItemsItem,
    ): { title: string; cardHref: string; headerTag1?: { label: string; value: string }; headerTag2?: { label: string; value: string } } => {
        switch (item.elasticItemType) {
            case ElasticItemElasticItemType.CONFIGURATION_ITEM: {
                const elasticItem = cardData as ConfigurationItemElasticItem
                return {
                    title: elasticItem.name ?? '',
                    cardHref: `/ci/${elasticItem.type}/${elasticItem.uuid}`,
                    headerTag1: {
                        value: t(`globalSearch.${elasticItem.elasticItemType}`, elasticItem.elasticItemType ?? ''),
                        label: t('globalSearch.category'),
                    },
                    headerTag2: { value: t(`ciType.${elasticItem.type}`, elasticItem.type ?? ''), label: t('globalSearch.type') },
                }
            }
            case ElasticItemElasticItemType.DMS_DOCUMENT: {
                const elasticItem = cardData as DmsDocumentElasticItem
                return {
                    title: elasticItem.fileName ?? '',
                    cardHref: getDocHref(elasticItem),
                    headerTag1: {
                        value: t(`globalSearch.${elasticItem.elasticItemType}`, elasticItem.elasticItemType ?? ''),
                        label: t('globalSearch.category'),
                    },
                    headerTag2: { value: t(`globalSearch.${elasticItem.refType}`, elasticItem.refType ?? ''), label: t('globalSearch.type') },
                }
            }
            case ElasticItemElasticItemType.RELATIONSHIP: {
                const elasticItem = cardData as RelationshipElasticItem
                return {
                    title: elasticItem.startName ?? '',
                    cardHref: `/relation/${elasticItem.startType}/${elasticItem.startUuid}/${elasticItem.uuid}`,
                    headerTag1: {
                        value: t(`globalSearch.${elasticItem.elasticItemType}`, elasticItem.elasticItemType ?? ''),
                        label: t('globalSearch.category'),
                    },
                    headerTag2: { value: elasticItem.typeName ?? '', label: t('globalSearch.type') },
                }
            }
            case ElasticItemElasticItemType.MEETING_REQUEST: {
                const elasticItem = cardData as MeetingRequestElasticItem
                return {
                    title: elasticItem.name ?? '',
                    cardHref: `${RouterRoutes.STANDARDIZATION_MEETINGS_LIST}/${elasticItem.id}`,
                    headerTag1: { value: t(`globalSearch.standardization`), label: t('globalSearch.category') },
                    headerTag2: {
                        value: t(`globalSearch.${elasticItem.elasticItemType}`, elasticItem.elasticItemType ?? ''),
                        label: t('globalSearch.type'),
                    },
                }
            }
            case ElasticItemElasticItemType.STANDARD_REQUEST: {
                const elasticItem = cardData as StandardRequestElasticItem
                return {
                    title: elasticItem.name ?? '',
                    cardHref: `${RouterRoutes.STANDARDIZATION_DRAFTS_LIST}/${elasticItem.id}`,
                    headerTag1: { value: t(`globalSearch.standardization`), label: t('globalSearch.category') },
                    headerTag2: {
                        value: t(`globalSearch.${elasticItem.elasticItemType}`, elasticItem.elasticItemType ?? ''),
                        label: t('globalSearch.type'),
                    },
                }
            }
            default:
                return { title: '', cardHref: `` }
        }
    }

    return (
        <Card {...getCardParams(cardData)}>
            <dl>
                {cardData.elasticItemType === ElasticItemElasticItemType.CONFIGURATION_ITEM && (
                    <>
                        <GlobalCardDefinitionItem
                            label={t('globalSearch.filter.owner') + ':'}
                            value={
                                getOwnerInformation((cardData as ConfigurationItemElasticItem).owner ?? '', ownerItems)?.configurationItemUi
                                    ?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
                            }
                        />
                        <GlobalCardDefinitionItem
                            label={t('globalSearch.code') + ':'}
                            value={(cardData as ConfigurationItemElasticItem).code ?? ''}
                        />
                        <GlobalCardDefinitionItem
                            label={t('globalSearch.state') + ':'}
                            value={(cardData as ConfigurationItemElasticItem).state ?? ''}
                        />
                    </>
                )}

                {cardData.highlight?.metaAttributes?.map((item, index) => (
                    <React.Fragment key={index}>
                        <GlobalCardDefinitionItem
                            label={t(`globalSearch.${item.field}`, item.field ?? '')}
                            value={item.highlightText ?? []}
                            setHtml
                        />
                    </React.Fragment>
                ))}

                {cardData.highlight?.attributes?.map((item, index) => (
                    <React.Fragment key={index}>
                        <GlobalCardDefinitionItem
                            label={t(`globalSearch.${item.field}`, item.field ?? '')}
                            value={item.highlightText ?? []}
                            setHtml
                        />
                    </React.Fragment>
                ))}

                {cardData.highlight?.otherAttributes?.map((item, index) => (
                    <React.Fragment key={index}>
                        <GlobalCardDefinitionItem
                            label={t(`globalSearch.${item.field}`, item.field ?? '')}
                            value={item.highlightText ?? []}
                            setHtml
                        />
                    </React.Fragment>
                ))}
                {cardData.highlight?.enumAttributes?.map((item, index) => (
                    <React.Fragment key={index}>
                        <GlobalCardDefinitionItem
                            label={t(`globalSearch.${item.field}`, item.field ?? '')}
                            value={item.highlightText ?? []}
                            setHtml
                        />
                    </React.Fragment>
                ))}
            </dl>
        </Card>
    )
}
