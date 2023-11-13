import React, { useEffect, useState } from 'react'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import {
    RelationshipUi,
    ConfigurationItemUi,
    useReadCiNeighboursWithAllRels,
    useReadRelationships,
    useStoreGraph,
    useStoreConfigurationItem,
    CiWithRelsUi,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useInvalidateCiItemCache, useInvalidateCiListFilteredCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { FieldValues } from 'react-hook-form'
import { v4 as uuidV4 } from 'uuid'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { useListRelatedCiTypes, useGetRelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useRedirectAfterSuccess } from '@isdd/metais-common/hooks/useRedirectAfterSucces'

import { PublicAuthorityState, RoleState } from '../PublicAuthorityAndRoleContainer'

import { formatFormAttributeValue } from '@/components/create-entity/createEntityHelpers'
import { CreateEntityData } from '@/components/create-entity/CreateEntity'
import { ITVSExceptionsCreateView } from '@/components/views/ci/ITVSExceptions/ITVSExceptionsCreateView'
import { filterRelatedList } from '@/componentHelpers/new-relation'

export interface RelationshipWithCiType extends RelationshipUi {
    ciType: string
}

interface Props {
    entityName: string
    data: CreateEntityData
    ownerId: string
    isLoading: boolean
    isError: boolean
    updateCiItemId?: string
    roleState?: RoleState
    publicAuthorityState?: PublicAuthorityState
    ciItemData?: ConfigurationItemUi | undefined
}

const relationSuffix = 'RELATION'
const relationNodes = ['ISVS', 'PO']
const relationType = 'osobitny_postup_vztah_ISVS'

export const ITVSExceptionsCreateContainer: React.FC<Props> = ({
    entityName,
    data,
    ownerId,
    updateCiItemId,
    isLoading,
    isError,
    roleState,
    publicAuthorityState,
    ciItemData,
}) => {
    const { t } = useTranslation()

    const [uploadError, setUploadError] = useState(false)

    const [relationshipSet, setRelationshipSet] = useState<RelationshipWithCiType[]>([])
    const [configurationItemId, setConfigurationItemId] = useState<string>(updateCiItemId ? updateCiItemId : '')

    const invalidateCilistFilteredCache = useInvalidateCiListFilteredCache()
    const invalidateCiByUuidCache = useInvalidateCiItemCache(updateCiItemId ? updateCiItemId : configurationItemId)

    const [isCreationLoading, setIsCreationLoading] = useState(false)
    const [requestId, setRequestId] = useState<string>('')

    //load all relationship types for CI - /related
    const { data: relatedListData, isLoading: isRelatedListLoading, isError: isRelatedListError } = useListRelatedCiTypes(entityName)
    //build select options from this data
    const relatedListAsSources = filterRelatedList(relatedListData?.cisAsSources, relationNodes)
    const relatedListAsTargets = filterRelatedList(relatedListData?.cisAsTargets, relationNodes)

    const { data: rels } = useReadCiNeighboursWithAllRels(updateCiItemId ?? '')
    const allCIsInRelations: CiWithRelsUi[] = rels?.ciWithRels ?? []

    const { data: relationTypeData, isLoading: isRelationTypeDataLoading, isError: isRelationTypeDataError } = useGetRelationshipType(relationType)

    const entityIdToUpdate = {
        cicode: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
        ciurl: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id],
    }

    const [formData, setFormData] = useState<FieldValues>({})

    const {
        data: readRelationShipsData,
        isLoading: isReadRelationshipsLoading,
        isError: isReadRelationshipsError,
        fetchStatus,
    } = useReadRelationships(configurationItemId ?? '')

    const { constraintsData, unitsData } = useDetailData({
        entityStructure: relationTypeData,
        isEntityStructureLoading: isRelationTypeDataLoading,
        isEntityStructureError: isRelationTypeDataError,
    })

    const {
        performRedirection,
        reset: resetRedirect,
        isLoading: isRedirectLoading,
        isError: isRedirectError,
        isFetched: isRedirectFetched,
        isProcessedError,
        isTooManyFetchesError,
    } = useRedirectAfterSuccess(requestId, configurationItemId, entityName)

    useEffect(() => {
        if (requestId != null) {
            performRedirection()
        }
    }, [performRedirection, requestId])

    const storeGraph = useStoreGraph({
        mutation: {
            async onSuccess(successData) {
                if (successData.requestId) {
                    setRequestId(successData.requestId)
                    invalidateCilistFilteredCache.invalidate({ ciType: entityName })
                    invalidateCiByUuidCache.invalidate()

                    setIsCreationLoading(false)
                } else {
                    setUploadError(true)
                    setIsCreationLoading(false)
                }
            },
            onError() {
                setUploadError(true)
            },
        },
    })

    const saveRelations = async () => {
        const formAttributesKeys = Object.keys(formData)

        const formattedAttributesToSend = formAttributesKeys
            .map((key) => ({
                name: key,
                value: formatFormAttributeValue(formData, key),
            }))
            .filter((attr) => attr.name.includes(relationSuffix))
            .map((relation) => {
                const splitted = relation.name.split(JOIN_OPERATOR)
                return {
                    name: splitted[0],
                    id: splitted[1],
                }
            })

        const relationRequestData = {
            storeSet: {
                relationshipSet: relationshipSet
                    ? relationshipSet.map((rel) => ({
                          ...rel,
                          startUuid: configurationItemId,
                          owner: updateCiItemId ? ciItemData?.metaAttributes?.owner : ownerId,
                          attributes: [
                              ...formattedAttributesToSend
                                  .filter((key) => key.id == rel.endUuid)
                                  .map((key) => ({
                                      name: key.name,
                                      value: formData[key.name + JOIN_OPERATOR + key.id + JOIN_OPERATOR + relationSuffix],
                                  })),
                          ],
                      }))
                    : [],
            },
        }

        await storeGraph.mutateAsync({ data: relationRequestData })
    }

    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            async onSuccess(successData) {
                if (successData.requestId != null) {
                    await saveRelations()
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    const onSubmit = async (formAttributes: FieldValues) => {
        setFormData(formAttributes)
        resetRedirect()
        setUploadError(false)
        setIsCreationLoading(true)
        const formAttributesKeys = Object.keys(formAttributes)

        const formattedAttributesToSend = formAttributesKeys
            .map((key) => ({
                name: key,
                value: formatFormAttributeValue(formAttributes, key),
            }))
            .filter((attr) => !attr.name.includes('RELATION'))

        const type = entityName

        const uuid = updateCiItemId ? updateCiItemId : uuidV4()
        setConfigurationItemId(uuid)

        const dataToUpdate = {
            uuid: uuid,
            type: type,
            attributes: formattedAttributesToSend,
        }

        const dataToCreate = {
            ...dataToUpdate,
            owner: ownerId,
        }

        await storeConfigurationItem.mutateAsync({
            data: updateCiItemId ? dataToUpdate : dataToCreate,
        })
    }

    const isDataLoading = [
        isRelatedListLoading,
        isRelationTypeDataLoading,
        updateCiItemId ? isReadRelationshipsLoading && fetchStatus == 'fetching' : false,
    ].some((item) => item)
    const isDataError = [isReadRelationshipsError, isRelatedListError, isRelationTypeDataError].some((item) => item)

    return (
        <>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">
                    {!updateCiItemId
                        ? t('ciType.createEntity', { entityName: t('ITVSExceptions.vynimky_ITVS') })
                        : t('ciType.editEntity', { entityName: t('ITVSExceptions.vynimky_ITVS') })}
                </TextHeading>
                {isError && <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />}
            </FlexColumnReverseWrapper>
            {!(isRedirectError || isProcessedError || isRedirectLoading) && (
                <MutationFeedback success={false} error={storeConfigurationItem.isError ? t('createEntity.mutationError') : ''} />
            )}
            <QueryFeedback
                loading={(isRedirectFetched && isRedirectLoading) || isCreationLoading}
                error={isRedirectFetched && (isRedirectError || isProcessedError || isTooManyFetchesError)}
                indicatorProps={{
                    label: updateCiItemId ? t('createEntity.redirectLoadingEdit') : t('createEntity.redirectLoading'),
                }}
                errorProps={{
                    errorMessage: isTooManyFetchesError
                        ? t('createEntity.tooManyFetchesError')
                        : updateCiItemId
                        ? t('createEntity.redirectErrorEdit')
                        : t('createEntity.redirectError'),
                }}
                withChildren
            >
                {/* <QueryFeedback loading={isCreationLoading} withChildren> */}
                <ITVSExceptionsCreateView
                    data={{ ...data, ownerId, generatedEntityId: updateCiItemId ? entityIdToUpdate : data.generatedEntityId }}
                    relationData={{
                        relatedListAsSources,
                        relatedListAsTargets,
                        readRelationShipsData,
                        relationTypeData,
                        constraintsData,
                        unitsData,
                        ciTypeData: data.attributesData.ciTypeData,
                    }}
                    roleState={roleState}
                    publicAuthorityState={publicAuthorityState}
                    onSubmit={onSubmit}
                    isProcessing={false}
                    isLoading={isLoading || isDataLoading}
                    isError={isError || isDataError}
                    defaultItemAttributeValues={ciItemData?.attributes}
                    relationshipSetState={{ relationshipSet, setRelationshipSet }}
                    uploadError={uploadError}
                    allCIsInRelations={allCIsInRelations ?? []}
                    updateCiItemId={updateCiItemId}
                />
            </QueryFeedback>
        </>
    )
}
