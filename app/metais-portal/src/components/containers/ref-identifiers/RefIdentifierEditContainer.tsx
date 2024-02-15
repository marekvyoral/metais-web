import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import {
    NeighbourPairUi,
    useInvalidateRelationship,
    useReadCiNeighbours,
    useStoreConfigurationItem,
    useStoreRelationship,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { INVALIDATED } from '@isdd/metais-common/constants'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { splitList } from '@isdd/metais-common/utils/utils'
import React, { useEffect } from 'react'
import { FieldValues } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

import { useCiCreateEditOnStatusSuccess, useCiCreateUpdateOnSubmit } from '@/components/create-entity/createEntityHelpers'
import { RefIdentifierCreateView } from '@/components/views/ref-identifiers/RefIdentifierCreateView'
import {
    RefCatalogFormType,
    RefCatalogFormTypeEnum,
    RefDataItemFormType,
    RefDataItemFormTypeEnum,
    RefDatasetFormType,
    RefDatasetFormTypeEnum,
    RefTemplateUriFormType,
    RefTemplateUriFormTypeEnum,
} from '@/components/views/ref-identifiers/forms/refCreateSchema'
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
        templateUriOptions,
        dataItemTypeOptions,
        isLoading: isRefLoading,
        isError: isRefError,
    } = useRefIdentifierHook(type)

    const {
        isFetching: isRelationFetching,
        isError: isRelationError,
        data: relationList,
    } = useReadCiNeighbours(updateCiItemId ?? '', {
        page: 1,
        perpage: 10000,
        neighboursFilter: {
            relType: [
                'URIDataset_patri_URIKatalog',
                'URIDataset_obsahuje_DatovyPrvok',
                'URIDataset_definuje_uri_ZC',
                'PO_je_gestor_URIKatalog',
                'Individuum_je_typu_DatovyPrvok',
                'DatovyPrvok_sa_sklada_DatovyPrvok',
            ],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
    })

    const defaultDatasetZC = relationList?.fromNodes?.neighbourPairs?.find((item) => item.relationship?.type === 'URIDataset_definuje_uri_ZC')
    const defaultDatasetItem = relationList?.fromNodes?.neighbourPairs?.find((item) => item.relationship?.type === 'URIDataset_obsahuje_DatovyPrvok')

    const defaultDatasets = relationList?.toNodes?.neighbourPairs?.filter((item) => item.relationship?.type === 'URIDataset_patri_URIKatalog')

    const defaultDatasetUuids = defaultDatasets?.map((item) => item.configurationItem?.uuid ?? '') || []

    const defaultCatalogPO = relationList?.toNodes?.neighbourPairs?.find((item) => item.relationship?.type === 'PO_je_gestor_URIKatalog')
    const defaultDataItemPO = relationList?.toNodes?.neighbourPairs?.find((item) => item.relationship?.type === 'PO_je_gestor_DatovyPrvok')

    const defaultTemplateUri = relationList?.toNodes?.neighbourPairs?.find((item) => item.relationship?.type === 'Individuum_je_typu_DatovyPrvok')
    const defaultDataItemTemplateUriList = relationList?.toNodes?.neighbourPairs?.filter(
        (item) => item.relationship?.type === 'DatovyPrvok_sa_sklada_DatovyPrvok',
    )
    const defaultDataItemTemplateUriUuids = defaultDataItemTemplateUriList?.map((item) => item.configurationItem?.uuid ?? '') || []

    const onStatusSuccess = useCiCreateEditOnStatusSuccess(`${RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS}`)
    const { isError: isRedirectError, isLoading: isRedirectLoading, isProcessedError, getRequestStatus, isTooManyFetchesError } = useGetStatus()
    const { onSubmit, setUploadError, configurationItemId } = useCiCreateUpdateOnSubmit(type)
    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess(successData) {
                if (successData.requestId != null) {
                    getRequestStatus(successData.requestId, () => onStatusSuccess({ configurationItemId, isUpdate: true, entityName: type ?? '' }))
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    const { isLoading: isStoreRelationsLoading, isError: isStoreRelationsError, mutateAsync: createRelations } = useStoreRelationship()

    const { mutateAsync: invalidateRelations } = useInvalidateRelationship()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (!(isRedirectError || isProcessedError || isRedirectLoading)) {
            scrollToMutationFeedback()
        }
    }, [isProcessedError, isRedirectError, isRedirectLoading, scrollToMutationFeedback])

    const isLoading = [isCiItemLoading, isRefLoading, isStoreRelationsLoading, isRelationFetching].some((item) => item)
    const isError = [isCiItemError, isRefError, isStoreRelationsError, isRelationError].some((item) => item)

    const updateCiItem = async (formData: FieldValues) => {
        const owner = groupDataFiltered.find((item) => item.orgId === formData[RefCatalogFormTypeEnum.OWNER])
        const ownerRoleGid = owner?.roles.find((role) => role.roleName == 'REFID_URI_DEF')?.gid
        const attributeList = {
            ...ciItemData?.attributes,
            ...formData.attributes,
        }
        await onSubmit({
            formData: attributeList,
            storeCiItem: storeConfigurationItem.mutateAsync,
            updateCiItemId,
            ownerId: ownerRoleGid,
            generatedEntityId,
        })

        return { ownerRoleGid }
    }

    const createNewRelation = async (relationType: string, relation: NeighbourPairUi | undefined, startUuid: string, ownerGid?: string) => {
        if (relation)
            await invalidateRelations({
                data: {
                    type: relationType,
                    uuid: relation?.relationship?.uuid,
                    startUuid: relation?.configurationItem?.uuid,
                    endUuid: updateCiItemId,
                    invalidateReason: {
                        comment: 'Created New',
                    },
                },
                params: {
                    newState: [INVALIDATED],
                },
            })

        await createRelations({
            data: {
                type: relationType,
                startUuid,
                uuid: uuidV4(),
                endUuid: updateCiItemId,
                owner: ownerGid,
                attributes: [],
            },
        })
    }

    const createNewRelationList = async (
        relationType: string,
        defaultList: NeighbourPairUi[] | undefined,
        currentList: string[],
        ownerGid?: string,
    ) => {
        const defaultListUuids = defaultList?.map((item) => item.configurationItem?.uuid ?? '') || []
        const { notInList1, notInList2 } = splitList(defaultListUuids, currentList)
        notInList1.forEach((itemId) => {
            createRelations({
                data: {
                    type: relationType,
                    startUuid: itemId,
                    uuid: uuidV4(),
                    endUuid: updateCiItemId,
                    owner: ownerGid,
                    attributes: [],
                },
            })
        })

        notInList2.forEach((itemId) => {
            const dataItem = defaultList?.find((item) => item.configurationItem?.uuid === itemId)
            invalidateRelations({
                data: {
                    type: relationType,
                    uuid: dataItem?.relationship?.uuid,
                    startUuid: dataItem?.configurationItem?.uuid,
                    endUuid: updateCiItemId,
                    invalidateReason: {
                        comment: 'Created New',
                    },
                },
                params: {
                    newState: [INVALIDATED],
                },
            })
        })
    }

    const handleDataItemSubmit = async (formData: RefDataItemFormType) => {
        const { ownerRoleGid } = await updateCiItem(formData)

        if (defaultDataItemPO?.configurationItem?.uuid !== formData[RefCatalogFormTypeEnum.PO]) {
            createNewRelation('PO_je_gestor_DatovyPrvok', defaultDataItemPO, formData[RefCatalogFormTypeEnum.PO], ownerRoleGid)
        }
        createNewRelationList(
            'DatovyPrvok_sa_sklada_DatovyPrvok',
            defaultDataItemTemplateUriList,
            formData[RefDataItemFormTypeEnum.DATA_ITEM],
            ownerRoleGid,
        )
    }
    const handleDatasetSubmit = async (formData: RefDatasetFormType) => {
        const { ownerRoleGid } = await updateCiItem(formData)

        if (defaultDatasetZC?.configurationItem?.uuid !== formData[RefDatasetFormTypeEnum.DATA_CODE]) {
            createNewRelation('URIDataset_definuje_uri_ZC', defaultDatasetZC, formData[RefDatasetFormTypeEnum.DATA_CODE], ownerRoleGid)
        }
        if (defaultDatasetItem?.configurationItem?.uuid !== formData[RefDatasetFormTypeEnum.DATA_ITEM]) {
            createNewRelation('URIDataset_obsahuje_DatovyPrvok', defaultDatasetItem, formData[RefDatasetFormTypeEnum.DATA_ITEM], ownerRoleGid)
        }
    }
    const handleTemplateUriSubmit = async (formData: RefTemplateUriFormType) => {
        const { ownerRoleGid } = await updateCiItem(formData)

        if (defaultTemplateUri?.configurationItem?.uuid !== formData[RefTemplateUriFormTypeEnum.TEMPLATE_URI]) {
            createNewRelation('Individuum_je_typu_DatovyPrvok', defaultTemplateUri, formData[RefTemplateUriFormTypeEnum.TEMPLATE_URI], ownerRoleGid)
        }
    }

    const handleCatalogSubmit = async (formData: RefCatalogFormType) => {
        const { ownerRoleGid } = await updateCiItem(formData)
        if (defaultCatalogPO?.configurationItem?.uuid !== formData[RefCatalogFormTypeEnum.PO]) {
            createNewRelation('PO_je_gestor_URIKatalog', defaultCatalogPO, formData[RefCatalogFormTypeEnum.PO], ownerRoleGid)
        }

        createNewRelationList('URIDataset_patri_URIKatalog', defaultDatasets, formData[RefCatalogFormTypeEnum.DATASET], ownerRoleGid)
    }

    const isDisabled = ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie] === 'c_stav_registracie.2'

    return (
        <RefIdentifierCreateView
            ciItemData={ciItemData}
            ciTypeData={ciTypeData}
            groupData={groupDataFiltered}
            generatedEntityId={generatedEntityId}
            attributes={attributes}
            dataItemTypeOptions={dataItemTypeOptions}
            templateUriOptions={templateUriOptions}
            ownerOptions={ownerOptions}
            datasetOptions={datasetOptions}
            defaultDatasets={defaultDatasetUuids}
            defaultPo={defaultCatalogPO?.configurationItem?.uuid || defaultDataItemPO?.configurationItem?.uuid}
            defaultTemplateUri={defaultTemplateUri?.configurationItem?.uuid}
            defaultDataItemTemplateUriUuids={defaultDataItemTemplateUriUuids}
            defaultDatasetZC={defaultDatasetZC?.configurationItem?.uuid}
            defaultDatasetItem={defaultDatasetItem?.configurationItem?.uuid}
            type={type}
            isDisabled={isDisabled}
            handleCatalogSubmit={handleCatalogSubmit}
            handleTemplateUriSubmit={handleTemplateUriSubmit}
            handleDataItemSubmit={handleDataItemSubmit}
            handleDatasetSubmit={handleDatasetSubmit}
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
