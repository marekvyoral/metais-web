import React from 'react'
import { useTranslation } from 'react-i18next'
import { TextLinkExternal } from '@isdd/idsk-ui-kit/typography/TextLinkExternal'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

import { RelationCard } from './cards/RelationCard'
import { CardColumnList } from './cards/CardColumnList'
import { ListActions } from './lists/ListActions'
import styles from './applicationServiceRelations.module.scss'

import { RelatedCiTypePreview, useGetRoleParticipantBulkUsingPOST, useReadCiNeighboursWithAllRelsUsingGET } from '@/api'

interface ApplicationServiceRelationsProps {
    entityId: string
    ciType: string
    entityTypes: RelatedCiTypePreview[]
}

export const ApplicationServiceRelations: React.FC<ApplicationServiceRelationsProps> = ({ entityId, ciType, entityTypes }) => {
    const { isLoading, isError, data } = useReadCiNeighboursWithAllRelsUsingGET(entityId, { ciTypes: [ciType] })
    const { t } = useTranslation()
    const owners = [...new Set(data?.ciWithRels?.map((rel) => rel?.ci?.metaAttributes?.owner).filter(Boolean))] as string[]
    const { isLoading: isOwnersLoading, isError: isOwnersError, data: ownersData } = useGetRoleParticipantBulkUsingPOST({ gids: owners })
    return (
        <>
            <ListActions>
                <Button
                    className={styles.buttonWithoutMarginBottom}
                    label={t('applicationServiceRelations.buttonAddNewRelation')}
                    variant="secondary"
                />
                <Button
                    className={styles.buttonWithoutMarginBottom}
                    label={t('applicationServiceRelations.buttonAddNewRelationCard')}
                    variant="secondary"
                />
            </ListActions>
            <CardColumnList>
                {data?.ciWithRels?.map((ciWithRel, index) => {
                    const ci = ciWithRel?.ci
                    const attributes = ci?.attributes
                    const owner = ownersData?.find((ownerData) => ownerData?.gid === ci?.metaAttributes?.owner)
                    const ownerName = owner?.configurationItemUi?.attributes?.Gen_Profil_nazov
                    const rels = ciWithRel?.rels?.map((rel) => {
                        const entityType = entityTypes.find((et) => et?.relationshipTypeTechnicalName === rel?.type)
                        return { ...rel, attributes: entityType }
                    })
                    return (
                        <RelationCard
                            key={index}
                            status={ci?.metaAttributes?.state}
                            codeMetaIS={attributes?.Gen_Profil_kod_metais}
                            label={
                                <TextLinkExternal
                                    title={attributes?.Gen_Profil_nazov}
                                    href={`/ci/redirect/${ci?.type}/${ci?.uuid}`}
                                    textLink={attributes?.Gen_Profil_nazov}
                                />
                            }
                            name={attributes?.Gen_Profil_nazov}
                            admin={ownerName}
                            relations={
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {rels?.map((rel) => (
                                        <TextLinkExternal
                                            key={rel?.attributes?.ciTypeTechnicalName}
                                            title={`${rel?.attributes?.relationshipTypeName} : ${rel?.metaAttributes?.state}`} // state needs to be translated
                                            href={`/relation/redirect/${ci?.type}/${ci?.uuid}/${rel?.uuid}`}
                                            textLink={`${rel?.attributes?.relationshipTypeName} : ${rel?.metaAttributes?.state}`}
                                        />
                                    ))}
                                </div>
                            }
                        />
                    )
                })}
            </CardColumnList>
        </>
    )
}
