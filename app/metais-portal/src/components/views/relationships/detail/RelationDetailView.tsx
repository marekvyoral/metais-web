import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback, pairEnumsToEnumValues } from '@isdd/metais-common/index'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { DESCRIPTION, HTML_TYPE, INVALIDATED } from '@isdd/metais-common/constants'
import { useQueryClient } from '@tanstack/react-query'
import { getReadRelationshipQueryKey, useStoreRelationship } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'
import { Stepper } from '@isdd/idsk-ui-kit/stepper/Stepper'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'

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
    const scrollRef = useRef<HTMLDivElement>(null)
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
            onSettled() {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
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
                              const rowValue = pairEnumsToEnumValues({
                                  attribute,
                                  ciItemData: relationshipData,
                                  constraintsData,
                                  t,
                                  unitsData,
                                  matchedAttributeNamesToCiItem: undefined,
                              })
                              const isHTML = attribute.type === HTML_TYPE || attribute.name == DESCRIPTION

                              return (
                                  attribute?.valid &&
                                  !attribute.invisible && (
                                      <InformationGridRow
                                          key={attribute.technicalName}
                                          label={attribute.name ?? ''}
                                          value={isHTML ? <SafeHtmlComponent dirtyHtml={(rowValue as string)?.replace(/\n/g, '<br>')} /> : rowValue}
                                      />
                                  )
                              )
                          }),
                      }
                  })
                : [],
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <div ref={scrollRef} />
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
                        {relationTypeData?.attributes?.map((attribute) => {
                            const rowValue = pairEnumsToEnumValues({
                                attribute,
                                ciItemData: relationshipData,
                                constraintsData,
                                t,
                                unitsData,
                                matchedAttributeNamesToCiItem: undefined,
                            })
                            const isHTML = attribute.type === HTML_TYPE || attribute.name == DESCRIPTION

                            return (
                                <InformationGridRow
                                    key={attribute.technicalName}
                                    label={(i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName) ?? attribute.name ?? ''}
                                    value={isHTML ? <SafeHtmlComponent dirtyHtml={(rowValue as string)?.replace(/\n/g, '<br>')} /> : rowValue}
                                />
                            )
                        })}
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

                    {!isEditable && sections.length > 0 && (
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
