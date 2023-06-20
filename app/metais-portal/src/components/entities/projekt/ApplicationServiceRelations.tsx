import React from 'react'
import { useTranslation } from 'react-i18next'
import { TextLinkExternal } from '@isdd/idsk-ui-kit/typography/TextLinkExternal'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

import { RelationCard } from './cards/RelationCard'
import { CardColumnList } from './cards/CardColumnList'
import { ListActions } from './lists/ListActions'
import styles from './applicationServiceRelations.module.scss'

import { CiWithRelsResultUi, RelatedCiTypePreview, RoleParticipantUI } from '@/api'

interface ApplicationServiceRelationsProps {
    entityTypes?: RelatedCiTypePreview[]
    relationsList?: CiWithRelsResultUi
    owners?: void | RoleParticipantUI[] | undefined
}

export const ApplicationServiceRelations: React.FC<ApplicationServiceRelationsProps> = ({ entityTypes, relationsList, owners }) => {
    const { t } = useTranslation()
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
                {relationsList?.ciWithRels?.map((ciWithRel, index) => {
                    const ci = ciWithRel?.ci
                    const attributes = ci?.attributes
                    const owner = owners?.find((o) => o?.gid === ci?.metaAttributes?.owner)
                    const ownerName = owner?.configurationItemUi?.attributes?.Gen_Profil_nazov
                    const rels = ciWithRel?.rels?.map((rel) => {
                        const entityType = entityTypes?.find((et) => et?.relationshipTypeTechnicalName === rel?.type)
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
                                rels?.map((rel, i) => {
                                    const title = `${rel?.attributes?.relationshipTypeName} : ${t(
                                        `metaAttributes.state.${rel?.metaAttributes?.state}`,
                                    )}`
                                    return (
                                        <TextLinkExternal
                                            key={rel?.attributes?.ciTypeTechnicalName ?? i}
                                            title={title}
                                            href={`/relation/redirect/${ci?.type}/${ci?.uuid}/${rel?.uuid}`}
                                            textLink={title}
                                        />
                                    )
                                }) ?? []
                            }
                        />
                    )
                })}
            </CardColumnList>
        </>
    )
}
