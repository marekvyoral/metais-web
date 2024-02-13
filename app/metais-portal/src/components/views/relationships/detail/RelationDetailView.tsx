import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { INVALIDATED } from '@isdd/metais-common/constants'
import { useQueryClient } from '@tanstack/react-query'
import { getReadRelationshipQueryKey, useStoreRelationship } from '@isdd/metais-common/api/generated/cmdb-swagger'

import { RelationDetailEditForm } from './RelationDetailEditForm'

import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RelationDetailProps } from '@/components/containers/RelationDetailContainer'

type Props = RelationDetailProps & {
    entityName: string
    entityId: string
    relationshipId: string
}

export const RelationDetailView: React.FC<Props> = ({ entityName, relationshipId, entityId, data, isLoading, isError, refetchRelationship }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { ownerData, relationTypeData, relationshipData, ciSourceData, ciTargetData, constraintsData, unitsData } = data
    const isInvalidated = relationshipData?.metaAttributes?.state === INVALIDATED

    const [isEditable, setIsEditable] = useState(false)

    const queryClient = useQueryClient()
    const relationshipQueryKey = getReadRelationshipQueryKey(relationshipId)
    const {
        isLoading: isEditLoading,
        isError: isEditError,
        mutateAsync: editRelation,
        isSuccess: isEditSuccess,
    } = useStoreRelationship({
        mutation: {
            onSuccess(_data, variables) {
                setIsEditable(false)
                queryClient.setQueryData(relationshipQueryKey, variables.data)
            },
        },
    })

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName, href: `/ci/${entityName}` },
                    {
                        label: ciSourceData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                    {
                        label: t('relationDetail.heading', { item: relationTypeData?.name }) ?? t('breadcrumbs.noName'),
                        href: `/relation/${entityName}/${entityId}/${relationshipId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <CiEntityIdHeader
                            editButton={<Button disabled={isEditable} label={t('ciType.editButton')} onClick={() => setIsEditable(true)} />}
                            entityData={relationshipData}
                            entityName={entityName}
                            entityId={entityId}
                            entityItemName={t('relationDetail.heading', { item: relationTypeData?.name })}
                            ciRoles={relationTypeData?.roleList ?? []}
                            isInvalidated={isInvalidated}
                            refetchCi={refetchRelationship}
                            isRelation
                        />
                        <QueryFeedback loading={false} error={isError} />
                        <MutationFeedback
                            success={isEditSuccess}
                            showSupportEmail
                            error={isEditError ? t('relationDetail.editError', { relationName: relationTypeData?.name }) : ''}
                            successMessage={t('relationDetail.editSuccess', { relationName: relationTypeData?.name })}
                        />
                    </FlexColumnReverseWrapper>

                    <DefinitionList>
                        <InformationGridRow label={t('relationDetail.source')} value={ciSourceData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]} />
                        <InformationGridRow label={t('relationDetail.target')} value={ciTargetData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]} />

                        <InformationGridRow
                            label={t('relationDetail.owner')}
                            value={
                                ownerData?.configurationItemUi?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] + ' - ' + ownerData?.role?.description
                            }
                        />
                        <InformationGridRow
                            label={t('relationDetail.evidenceStatus')}
                            value={t(`metaAttributes.state.${relationshipData?.metaAttributes?.state}`)}
                        />
                    </DefinitionList>

                    {isEditable && (
                        <RelationDetailEditForm
                            relationTypeData={relationTypeData}
                            relationshipData={relationshipData}
                            constraintsData={constraintsData}
                            unitsData={unitsData}
                            setIsEditable={setIsEditable}
                            isEditLoading={isEditLoading}
                            editRelation={editRelation}
                        />
                    )}

                    {!isEditable && (
                        <>
                            <DefinitionList>
                                {relationTypeData?.attributes
                                    ?.concat(relationTypeData?.attributeProfiles?.flatMap((profile) => profile.attributes ?? []) ?? [])
                                    .map((attribute) => {
                                        const value = relationshipData?.attributes?.find((relAttr) => relAttr.name === attribute.technicalName)?.value
                                        return (
                                            <InformationGridRow
                                                key={attribute.technicalName}
                                                label={attribute.name ?? ''}
                                                //cause of bad generated type
                                                value={typeof value == 'string' ? value : ''}
                                            />
                                        )
                                    })}
                            </DefinitionList>
                            <Button variant="secondary" label={t('relationDetail.back')} onClick={() => navigate(`/ci/${entityName}/${entityId}`)} />
                        </>
                    )}
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
