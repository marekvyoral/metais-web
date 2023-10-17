import React, { useEffect, useState } from 'react'
import {
    ConfigurationItemUi,
    useGetRelationshipType,
    useListRelatedCiTypes,
    useReadRelationships,
    useStoreConfigurationItem,
    useStoreGraph,
} from '@isdd/metais-common/api'
import { useInvalidateCiItemCache, useInvalidateCiListFilteredCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useRedirectAfterSuccess } from '@isdd/metais-common/hooks/useRedirectAfterSucces'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { FieldValues } from 'react-hook-form'
import { v4 as uuidV4 } from 'uuid'
import { useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { filter } from 'd3'

import { PublicAuthorityState, RoleState } from '../PublicAuthorityAndRoleContainer'

import { CreateEntityData } from '@/components/create-entity/CreateEntity'
import { ITVSExceptionsCreateView } from '@/components/views/ci/vynimkyITVS/ITVSExceptionsCreateView'
import { filterRelatedList } from '@/componentHelpers/new-relation'
import { formatFormAttributeValue } from '@/components/create-entity/createEntityHelpers'

interface Props {
    entityName: string
    data: CreateEntityData
    ownerId: string
    isLoading: boolean
    isError: boolean
    updateCiItemId?: string
    roleState?: RoleState
    publicAuthorityState?: PublicAuthorityState
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
}) => {
    const { t } = useTranslation()

    const [uploadError, setUploadError] = useState(false)

    const [requestId, setRequestId] = useState<string>('')
    const [selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName] = useState<string>('')
    const [selectedCITypeForRelationTechnicalName, setSelectedCITypeForRelationTechnicalName] = useState<string>('')
    const [configurationItemId, setConfigurationItemId] = useState<string>('')

    const { selectedItems, setSelectedItems, setIsListPageOpen, isListPageOpen } = useNewRelationData()

    const invalidateCilistFilteredCache = useInvalidateCiListFilteredCache()
    const invalidateCiByUuidCache = useInvalidateCiItemCache(updateCiItemId ? updateCiItemId : configurationItemId)

    //load all relationship types for CI
    const { data: relatedListData, isLoading: isRelatedListLoading, isError: isRelatedListError } = useListRelatedCiTypes(entityName)

    //build select options from this data
    const relatedListAsSources = filterRelatedList(relatedListData?.cisAsSources, ['ISVS', 'WeboveSidlo', 'PO'])
    const relatedListAsTargets = filterRelatedList(relatedListData?.cisAsTargets, ['ISVS', 'WeboveSidlo', 'PO'])

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
    } = useGetRelationshipType(selectedRelationTypeTechnicalName ?? '')

    const { constraintsData, unitsData } = useDetailData({
        entityStructure: relationTypeData,
        isEntityStructureLoading: isRelationTypeDataLoading,
        isEntityStructureError: isRelationTypeDataError,
    })

    const storeGraph = useStoreGraph({
        mutation: {
            onSuccess() {
                setIsListPageOpen(false)
                setSelectedItems(null)
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

        const formattedAttributesToSend = filter(
            formAttributesKeys.map((key) => ({
                name: key,
                value: formatFormAttributeValue(formData, key),
            })),
            (attr) => attr.name.includes('RELATION'),
        ).map((relation) => {
            const splitted = relation.name.split(JOIN_OPERATOR)
            return {
                name: splitted[0],
                id: splitted[1],
            }
        })

        const relationRequestData = {
            storeSet: {
                relationshipSet:
                    selectedItems && Array.isArray(selectedItems)
                        ? selectedItems.map((item: ConfigurationItemUi) => ({
                              type: selectedRelationTypeTechnicalName,
                              attributes: [
                                  ...formattedAttributesToSend
                                      .filter((key) => key.id == item.uuid)
                                      .map((key) => ({
                                          name: key.name,
                                          value: formData[key.name + JOIN_OPERATOR + key.id + JOIN_OPERATOR + 'RELATION'],
                                      })),
                              ],
                              //uuid of picked entities
                              startUuid: configurationItemId,
                              //id of current entity
                              endUuid: item.uuid,
                              //from getGroup Api
                              owner: ownerId,
                              uuid: uuidV4(),
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

        const formattedAttributesToSend = filter(
            formAttributesKeys.map((key) => ({
                name: key,
                value: formatFormAttributeValue(formAttributes, key),
            })),
            (attr) => !attr.name.includes('RELATION'),
        )

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
                    <TextHeading size="XL">{!updateCiItemId ? t('ciType.createEntity') : t('ciType.editEntity')}</TextHeading>
                    {isError && <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />}
                </FlexColumnReverseWrapper>
                {!updateCiItemId && publicAuthorityState && roleState && (
                    <SelectPublicAuthorityAndRole
                        selectedRoleId={roleState.selectedRole}
                        onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                        onChangeRole={roleState.setSelectedRole}
                        selectedOrg={publicAuthorityState.selectedPublicAuthority}
                    />
                )}
                <ITVSExceptionsCreateView
                    data={{ ...data, ownerId }}
                    relationData={{ relatedListAsSources, relatedListAsTargets, readRelationShipsData, relationTypeData, constraintsData, unitsData }}
                    onSubmit={onSubmit}
                    isProcessing={false}
                    isLoading={isLoading || isRelatedListLoading}
                    isError={isError}
                    selectedRelationTypeState={{ selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName }}
                    selectedCITypeForRelationState={{ selectedCITypeForRelationTechnicalName, setSelectedCITypeForRelationTechnicalName }}
                    selectedRelationItemsState={{ selectedItems, setSelectedItems, setIsListPageOpen, isListPageOpen }}
                />
            </QueryFeedback>
        </>
    )
}
