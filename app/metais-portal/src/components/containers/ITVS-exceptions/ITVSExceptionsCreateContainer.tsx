import React, { useEffect, useState } from 'react'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import {
    RelationshipUi,
    ConfigurationItemUi,
    useReadCiNeighboursWithAllRels,
    useReadRelationships,
    useStoreGraph,
    useStoreConfigurationItem,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useInvalidateCiItemCache, useInvalidateCiListFilteredCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useRedirectAfterSuccess } from '@isdd/metais-common/hooks/useRedirectAfterSucces'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { FieldValues } from 'react-hook-form'
import { v4 as uuidV4 } from 'uuid'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { useListRelatedCiTypes, useGetRelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { PublicAuthorityState, RoleState } from '../PublicAuthorityAndRoleContainer'

import { CreateEntityData } from '@/components/create-entity/CreateEntity'
import { ITVSExceptionsCreateView } from '@/components/views/ci/ITVSExceptions/ITVSExceptionsCreateView'
import { filterRelatedList } from '@/componentHelpers/new-relation'
import { formatFormAttributeValue } from '@/components/create-entity/createEntityHelpers'

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

    const relationSuffix = 'RELATION'

    const [uploadError, setUploadError] = useState(false)

    const [requestId, setRequestId] = useState<string>('')
    const [relationshipSet, setRelationshipSet] = useState<RelationshipWithCiType[]>([])
    const [configurationItemId, setConfigurationItemId] = useState<string>('')

    const [existingRelations, setExistingRelations] = useState<ConfigurationItemUi[]>()

    const invalidateCilistFilteredCache = useInvalidateCiListFilteredCache()
    const invalidateCiByUuidCache = useInvalidateCiItemCache(updateCiItemId ? updateCiItemId : configurationItemId)

    //load all relationship types for CI
    const { data: relatedListData, isLoading: isRelatedListLoading, isError: isRelatedListError } = useListRelatedCiTypes(entityName)

    const { data: rels } = useReadCiNeighboursWithAllRels(updateCiItemId ?? '')

    useEffect(() => {
        return () => {
            const cis = rels?.ciWithRels?.map((ciWithRel) => ciWithRel.ci)
            setExistingRelations(cis as ConfigurationItemUi[])
            //setSelectedISVSs(cis as ConfigurationItemUi[])
        }
    }, [rels])

    //build select options from this data
    const relatedListAsSources = filterRelatedList(relatedListData?.cisAsSources, ['ISVS', 'PO'])
    const relatedListAsTargets = filterRelatedList(relatedListData?.cisAsTargets, ['ISVS', 'PO'])

    const entityIdToUpdate = {
        cicode: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
        ciurl: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id],
    }

    const [formData, setFormData] = useState<FieldValues>({})

    const {
        data: readRelationShipsData,
        isLoading: isReadRelationshipsLoading,
        isError: isReadRelationshipsError,
    } = useReadRelationships(configurationItemId ?? '')

    //load relationship type detail data
    const {
        data: relationTypeData,
        isLoading: isRelationTypeDataLoading,
        isError: isRelationTypeDataError,
    } = useGetRelationshipType('osobitny_postup_vztah_ISVS')

    const { constraintsData, unitsData } = useDetailData({
        entityStructure: relationTypeData,
        isEntityStructureLoading: isRelationTypeDataLoading,
        isEntityStructureError: isRelationTypeDataError,
    })

    const storeGraph = useStoreGraph({
        mutation: {
            onSuccess() {
                // setIsISVSListPageOpen(false)
                // setSelectedISVSs(null)
                invalidateCilistFilteredCache.invalidate({ ciType: entityName })
                invalidateCiByUuidCache.invalidate()
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
                          owner: ownerId,
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
                    setRequestId(successData.requestId)
                    await saveRelations()
                } else {
                    setUploadError(true)
                }
            },
        },
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

    const onSubmit = async (formAttributes: FieldValues) => {
        setFormData(formAttributes)

        setRequestId('')
        setUploadError(false)
        resetRedirect()
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

        await storeConfigurationItem.mutate({
            data: updateCiItemId ? dataToUpdate : dataToCreate,
        })
    }

    // const isDataLoading = [isReadRelationshipsLoading, isRelatedListLoading, isRelationTypeDataLoading, isDetailDataLoading].some((item) => item)
    // const isDataError = [isReadRelationshipsError, isRelatedListError, isRelationTypeDataError, isDetailDataError].some((item) => item)

    return (
        <>
            {!(isRedirectError || isProcessedError || isRedirectLoading) && (
                <MutationFeedback success={false} error={storeConfigurationItem.isError ? t('createEntity.mutationError') : ''} />
            )}
            <QueryFeedback
                loading={isRedirectFetched && isRedirectLoading}
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
                <FlexColumnReverseWrapper>
                    <TextHeading size="XL">
                        {!updateCiItemId
                            ? t('ciType.createEntity', { entityName: t('ITVSExceptions.vynimky_ITVS') })
                            : t('ciType.editEntity', { entityName: t('ITVSExceptions.vynimky_ITVS') })}
                    </TextHeading>
                    {isError && <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />}
                </FlexColumnReverseWrapper>
                <ITVSExceptionsCreateView
                    data={{ ...data, ownerId, generatedEntityId: updateCiItemId ? entityIdToUpdate : data.generatedEntityId }}
                    relationData={{
                        relatedListAsSources,
                        relatedListAsTargets,
                        readRelationShipsData,
                        relationTypeData,
                        constraintsData,
                        unitsData,
                        ciTypeData: undefined,
                    }}
                    roleState={roleState}
                    publicAuthorityState={publicAuthorityState}
                    onSubmit={onSubmit}
                    isProcessing={false}
                    isLoading={isLoading || isRelatedListLoading}
                    isError={isError}
                    defaultItemAttributeValues={ciItemData?.attributes}
                    relationshipSetState={{ relationshipSet, setRelationshipSet }}
                    existingRelations={rels}
                />
            </QueryFeedback>
        </>
    )
}
