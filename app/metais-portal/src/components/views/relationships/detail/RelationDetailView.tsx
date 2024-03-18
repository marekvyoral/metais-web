import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback, formatRowValueByRowType } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { INVALIDATED } from '@isdd/metais-common/constants'
import { useQueryClient } from '@tanstack/react-query'
import { getReadRelationshipQueryKey, useStoreRelationship } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { AttributeAttributeTypeEnum, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'
import { Stepper } from '@isdd/idsk-ui-kit/stepper/Stepper'

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
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [sections, setSections] = useState<ISection[]>([])
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

    const handleSectionOpen = (id: string) => {
        setSections((prev) => prev.map((item) => (item.id === id ? { ...item, isOpen: !item.isOpen } : item)))
    }

    const openOrCloseAllSections = () => {
        setSections((prev) => {
            const allOpen = prev.every((item) => item.isOpen)
            return prev.map((item) => ({ ...item, isOpen: !allOpen }))
        })
    }

    useEffect(() => {
        setSections(
            relationTypeData?.attributeProfiles && Array.isArray(relationTypeData?.attributeProfiles)
                ? relationTypeData?.attributeProfiles?.map((profile: AttributeProfile, index) => {
                      return {
                          title: (i18n.language === Languages.SLOVAK ? profile.description : profile.engDescription) ?? profile.name ?? '',
                          //error: getAttributesInputErrorMessage(profile.attributes ?? [], formState.errors),
                          stepLabel: { label: (index + 1).toString(), variant: 'circle' },
                          id: profile.id ? profile.id.toString() : 'default_id',
                          last: relationTypeData?.attributeProfiles?.length === index + 1 ? true : false,
                          content: profile.attributes?.map((attribute) => {
                              const value = relationshipData?.attributes?.find((relAttr) => relAttr.name === attribute.technicalName)?.value ?? ''

                              const constraint = constraintsData
                                  ?.find((c) => c?.enumItems?.find((e) => e?.code === value.toString()))
                                  ?.enumItems?.find((e) => e?.code === value.toString())?.value

                              return (
                                  attribute?.valid &&
                                  !attribute.invisible && (
                                      <InformationGridRow
                                          key={attribute.technicalName}
                                          label={attribute.name ?? ''}
                                          value={
                                              attribute.type === AttributeAttributeTypeEnum.STRING
                                                  ? constraint
                                                      ? constraint
                                                      : value.toString()
                                                  : formatRowValueByRowType({ attribute, rowValue: value.toString(), t, unitsData })
                                          }
                                      />
                                  )
                              )
                          }),
                      }
                  })
                : [],
        )
    }, [relationTypeData?.attributeProfiles, i18n.language, relationshipData?.attributes, constraintsData, t, unitsData, ciSourceData])

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
                            error={isEditError}
                            errorMessage={t('relationDetail.editError', { relationName: relationTypeData?.name })}
                            successMessage={t('relationDetail.editSuccess', { relationName: relationTypeData?.name })}
                        />
                    </FlexColumnReverseWrapper>

                    <DefinitionList>
                        <InformationGridRow
                            label={t('relationDetail.source')}
                            value={
                                <Link to={`/ci/${ciSourceData?.type}/${ciSourceData?.uuid}`}>
                                    {ciSourceData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                                </Link>
                            }
                        />
                        <InformationGridRow
                            label={t('relationDetail.target')}
                            value={
                                <Link to={`/ci/${ciTargetData?.type}/${ciTargetData?.uuid}`}>
                                    {ciTargetData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                                </Link>
                            }
                        />
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
                                <Stepper
                                    subtitleTitle=""
                                    stepperList={sections}
                                    handleSectionOpen={handleSectionOpen}
                                    openOrCloseAllSections={openOrCloseAllSections}
                                />
                            </DefinitionList>

                            <Button variant="secondary" label={t('relationDetail.back')} onClick={() => navigate(`/ci/${entityName}/${entityId}`)} />
                        </>
                    )}
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
