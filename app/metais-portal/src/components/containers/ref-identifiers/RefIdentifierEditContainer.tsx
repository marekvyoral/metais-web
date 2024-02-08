import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import {
    useInvalidateRelationship,
    useReadCiNeighbours,
    useStoreConfigurationItem,
    useStoreRelationship,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { splitList } from '@isdd/metais-common/utils/utils'

import { useCiCreateEditOnStatusSuccess, useCiCreateUpdateOnSubmit } from '@/components/create-entity/createEntityHelpers'
import { RefIdentifierCreateView } from '@/components/views/ref-identifiers/RefIdentifierCreateView'
import { RefCatalogFormType, RefCatalogFormTypeEnum } from '@/components/views/ref-identifiers/forms/refCreateSchema'
import { RefIdentifierListShowEnum } from '@/components/views/ref-identifiers/refIdentifierListProps'
import { useRefIdentifierHook } from '@/hooks/useRefIdentifier.hook'

export interface RefIdentifierListFilterData extends IFilterParams, IFilter {
    type: RefIdentifierTypeEnum[]
    state: string
    createdAtFrom: string
    createdAtTo: string
    view: RefIdentifierListShowEnum
}

export const RefIdentifierEditContainer: React.FC = () => {
    const { id: updateCiItemId } = useParams()

    const { ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(updateCiItemId)

    const type = ciItemData?.type as RefIdentifierTypeEnum

    const {
        ciTypeData,
        attributes,
        datasetOptions,
        generatedEntityId,
        ownerOptions,
        groupDataFiltered,
        isLoading: isRefLoading,
        isError: isRefError,
    } = useRefIdentifierHook(type)

    const {
        isLoading: isRelationLoading,
        isFetching: isRelationFetching,
        isError: isRelationError,
        data: relationList,
        refetch,
    } = useReadCiNeighbours(updateCiItemId ?? '', {
        page: 1,
        perpage: 10000,
        neighboursFilter: {
            relType: ['URIDataset_patri_URIKatalog', 'PO_je_gestor_URIKatalog'],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
    })

    const defaultDatasets = relationList?.toNodes?.neighbourPairs?.filter((item) => item.relationship?.type === 'URIDataset_patri_URIKatalog')
    console.log('ababa', defaultDatasets)

    const defaultDatasetUuids = defaultDatasets?.map((item) => item.configurationItem?.uuid ?? '') || []

    const defaultPO = relationList?.toNodes?.neighbourPairs?.find((item) => item.relationship?.type === 'PO_je_gestor_URIKatalog')

    console.log('alx', defaultPO, relationList)
    const onStatusSuccess = useCiCreateEditOnStatusSuccess(`${RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS}`)
    const { isError: isRedirectError, isLoading: isRedirectLoading, isProcessedError, getRequestStatus, isTooManyFetchesError } = useGetStatus()
    const { onSubmit, uploadError, setUploadError, configurationItemId } = useCiCreateUpdateOnSubmit(type)
    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess(successData) {
                if (successData.requestId != null) {
                    getRequestStatus(successData.requestId, () => onStatusSuccess({ configurationItemId, isUpdate: false, entityName: type ?? '' }))
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    const {
        isLoading: isStoreRelationsLoading,
        isError: isStoreRelationsError,
        mutateAsync: createRelations,
        isSuccess: isStoreSuccess,
    } = useStoreRelationship()

    const {
        isLoading: isInvalidateRelationsLoading,
        isError: isInvalidateRelationsError,
        mutateAsync: invalidateRelations,
        isSuccess: isInvalidateRelationsSuccess,
    } = useInvalidateRelationship()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (!(isRedirectError || isProcessedError || isRedirectLoading)) {
            scrollToMutationFeedback()
        }
    }, [isProcessedError, isRedirectError, isRedirectLoading, scrollToMutationFeedback])

    const isLoading = [isCiItemLoading, isRefLoading, isStoreRelationsLoading].some((item) => item)
    const isError = [isCiItemError, isRefError, isStoreRelationsError].some((item) => item)

    const handleCatalogSubmit = async (formData: RefCatalogFormType) => {
        // const { notInList1, notInList2 } = splitList(formData[RefCatalogFormTypeEnum.DATASET], defaultDatasetUuids)
        // console.log('skaaa', formData[RefCatalogFormTypeEnum.DATASET], defaultDatasetUuids)
        // console.log('ska', notInList1, notInList2)
        // return
        const ownerId = groupDataFiltered
            .find((item) => item.orgId === formData[RefCatalogFormTypeEnum.OWNER])
            ?.roles.find((role) => role.roleName == 'REFID_URI_DEF')?.gid
        const attributeList = {
            ...ciItemData?.attributes,
            ...formData.attributes,
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]: formatDateForDefaultValue(formData.attributes[ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]),
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]: formatDateForDefaultValue(formData.attributes[ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]),
        }
        await onSubmit({
            formData: attributeList,
            storeCiItem: storeConfigurationItem.mutateAsync,
            updateCiItemId,
            ownerId: ownerId,
            generatedEntityId,
        })
        if (defaultPO?.configurationItem?.uuid !== formData[RefCatalogFormTypeEnum.PO]) {
            if (defaultPO)
                await invalidateRelations({
                    data: {
                        type: 'PO_je_gestor_URIKatalog',
                        uuid: defaultPO?.relationship?.uuid,
                        startUuid: defaultPO?.configurationItem?.uuid,
                        endUuid: updateCiItemId,
                        invalidateReason: {
                            comment: 'Created New',
                        },
                    },
                    params: { newState: [] },
                })
            await createRelations({
                data: {
                    type: 'PO_je_gestor_URIKatalog',
                    startUuid: formData[RefCatalogFormTypeEnum.PO],
                    uuid: uuidV4(),
                    endUuid: updateCiItemId,
                    owner: ownerId,
                    attributes: [],
                },
            })
        }
        const { notInList1, notInList2 } = splitList(defaultDatasetUuids, formData[RefCatalogFormTypeEnum.DATASET])

        notInList1.forEach((datasetId) => {
            createRelations({
                data: {
                    type: 'URIDataset_patri_URIKatalog',
                    startUuid: datasetId,
                    uuid: uuidV4(),
                    endUuid: updateCiItemId,
                    owner: ownerId,
                    attributes: [],
                },
            })
        })

        notInList2.forEach((datasetId) => {
            const dataset = defaultDatasets?.find((item) => item.configurationItem?.uuid === datasetId)
            invalidateRelations({
                data: {
                    type: 'URIDataset_patri_URIKatalog',
                    uuid: updateCiItemId,
                    startUuid: dataset?.relationship?.uuid,
                    endUuid: datasetId,
                    invalidateReason: {
                        comment: 'Created New',
                    },
                },
                params: { newState: [] },
            })
        })
    }

    return (
        <RefIdentifierCreateView
            ciItemData={ciItemData}
            ciTypeData={ciTypeData}
            groupData={groupDataFiltered}
            generatedEntityId={generatedEntityId}
            attributes={attributes}
            ownerOptions={ownerOptions}
            datasetOptions={datasetOptions}
            defaultDatasets={defaultDatasetUuids}
            defaultPo={defaultPO?.configurationItem?.uuid}
            type={type}
            handleCatalogSubmit={handleCatalogSubmit}
            wrapperRef={wrapperRef}
            isUpdate
            isProcessedError={isProcessedError}
            isRedirectError={isRedirectError}
            isRedirectLoading={isRedirectLoading}
            isStoreError={storeConfigurationItem.error}
            isTooManyFetchesError={isTooManyFetchesError}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
