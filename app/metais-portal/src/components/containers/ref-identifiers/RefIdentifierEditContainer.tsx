import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, RELATION_TYPE, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import {
    AttributeUiValue,
    NeighbourPairUi,
    useInvalidateConfigurationItem,
    useInvalidateRelationship,
    useReadCiNeighbours,
    useStoreConfigurationItem,
    useStoreRelationship,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { INVALIDATED } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useInvalidateRefIdentifiersCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { splitList } from '@isdd/metais-common/utils/utils'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { useGenerateCodeHook } from '@isdd/metais-common/api/generated/types-repo-swagger'

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
const defaultInvalidateReasonMessage = 'Created new'

export const RefIdentifierEditContainer: React.FC = () => {
    const { id: updateCiItemId } = useParams()

    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const { invalidate: invalidateCache } = useInvalidateRefIdentifiersCache(updateCiItemId ?? '')

    const { ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(updateCiItemId)

    const [isUriExist, setIsUriExist] = useState<boolean>(false)

    const type = ciItemData?.type as RefIdentifierTypeEnum

    const generateRelCode = useGenerateCodeHook()
    const {
        ciTypeData,
        attributes,
        datasetOptions,
        generatedEntityId,
        ownerOptions,
        groupDataFiltered,
        templateUriOptions,
        dataItemTypeOptions,
        checkUriIfExist,
        isCheckUriLoading,
        isLoading: isRefLoading,
        isError: isRefError,
    } = useRefIdentifierHook(type)

    const {
        isFetching: isRelationFetching,
        isError: isRelationError,
        data: relationList,
    } = useReadCiNeighbours(
        updateCiItemId ?? '',
        {
            page: 1,
            perpage: 10000,
            neighboursFilter: {
                relType: [
                    RELATION_TYPE.URIDataset_patri_URIKatalog,
                    RELATION_TYPE.URIDataset_obsahuje_DatovyPrvok,
                    RELATION_TYPE.URIDataset_definuje_uri_ZC,
                    RELATION_TYPE.PO_je_gestor_URIKatalog,
                    RELATION_TYPE.PO_je_gestor_DatovyPrvok,
                    RELATION_TYPE.Individuum_je_typu_DatovyPrvok,
                    RELATION_TYPE.DatovyPrvok_sa_sklada_DatovyPrvok,
                ],
                metaAttributes: {
                    state: ['DRAFT'],
                },
            },
        },
        { query: { cacheTime: 0 } },
    )

    const defaultDatasetZC = relationList?.fromNodes?.neighbourPairs?.find(
        (item) => item.relationship?.type === RELATION_TYPE.URIDataset_definuje_uri_ZC,
    )
    const defaultDatasetItem = relationList?.fromNodes?.neighbourPairs?.find(
        (item) => item.relationship?.type === RELATION_TYPE.URIDataset_obsahuje_DatovyPrvok,
    )

    const defaultDatasets = relationList?.toNodes?.neighbourPairs?.filter(
        (item) => item.relationship?.type === RELATION_TYPE.URIDataset_patri_URIKatalog,
    )

    const defaultDatasetUuids = defaultDatasets?.map((item) => item.configurationItem?.uuid ?? '') || []

    const defaultCatalogPO = relationList?.toNodes?.neighbourPairs?.find((item) => item.relationship?.type === RELATION_TYPE.PO_je_gestor_URIKatalog)
    const defaultDataItemPO = relationList?.toNodes?.neighbourPairs?.find(
        (item) => item.relationship?.type === RELATION_TYPE.PO_je_gestor_DatovyPrvok,
    )

    const defaultTemplateUri = relationList?.fromNodes?.neighbourPairs?.find(
        (item) => item.relationship?.type === RELATION_TYPE.Individuum_je_typu_DatovyPrvok,
    )

    const defaultDataItemTemplateUriList = relationList?.fromNodes?.neighbourPairs?.filter(
        (item) => item.relationship?.type === RELATION_TYPE.DatovyPrvok_sa_sklada_DatovyPrvok,
    )
    const defaultDataItemTemplateUriUuids = defaultDataItemTemplateUriList?.map((item) => item.configurationItem?.uuid ?? '') || []

    const onStatusSuccess = useCiCreateEditOnStatusSuccess(`${RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS}`)

    const { isError: isRedirectError, isLoading: isRedirectLoading, isProcessedError, getRequestStatus, isTooManyFetchesError } = useGetStatus()
    const { onSubmit, setUploadError, configurationItemId } = useCiCreateUpdateOnSubmit(type)

    const onInvalidateStatusSuccess = () => {
        invalidateCache()
        const toPath = `${RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS}/${updateCiItemId}`
        setIsActionSuccess({ value: true, path: toPath, additionalInfo: { type: 'invalidate' } })
        navigate(toPath, { state: { from: location } })
    }

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

    const isLoading = [isCiItemLoading, isRefLoading, isRelationFetching].some((item) => item)
    const isError = [isCiItemError, isRefError, isRelationError].some((item) => item)

    const {
        mutateAsync: setInvalid,
        isLoading: isInvalidating,
        isError: isInvalidateError,
    } = useInvalidateConfigurationItem({
        mutation: {
            onSuccess: (data) => {
                if (data.requestId != null) {
                    getRequestStatus(data.requestId, () => onInvalidateStatusSuccess())
                } else {
                    setUploadError(true)
                }
            },
            onError: () => {
                setUploadError(true)
            },
        },
    })

    const updateCiItem = async (formData: FieldValues) => {
        const owner = groupDataFiltered.find((item) => item.orgId === formData[RefCatalogFormTypeEnum.OWNER])
        const ownerRoleGid = owner?.roles.find((role) => role.roleName == 'REFID_URI_DEF')?.gid
        const attributeList = {
            ...ciItemData?.attributes,
            ...formData.attributes,
        }
        const uuid = await onSubmit({
            formData: attributeList,
            storeCiItem: storeConfigurationItem.mutateAsync,
            updateCiItemId,
            ownerId: ownerRoleGid,
            generatedEntityId,
        })

        return { ownerRoleGid, uuid }
    }

    const createNewRelation = async (
        relationType: string,
        relation: NeighbourPairUi | undefined,
        startUuid: string,
        endUuid: string,
        ownerGid?: string,
    ) => {
        if (relation)
            await invalidateRelations({
                data: {
                    type: relationType,
                    uuid: relation?.relationship?.uuid,
                    startUuid: startUuid,
                    endUuid: endUuid,
                    invalidateReason: {
                        comment: defaultInvalidateReasonMessage,
                    },
                },
                params: {
                    newState: [INVALIDATED],
                },
            })

        const relCode = await generateRelCode(relationType)
        await createRelations({
            data: {
                type: relationType,
                startUuid: startUuid,
                uuid: uuidV4(),
                endUuid: endUuid,
                owner: ownerGid,
                attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCode.code as unknown as AttributeUiValue }],
            },
        })
    }

    const createNewRelationList = async (
        relationType: string,
        defaultList: NeighbourPairUi[] | undefined,
        currentList: string[],
        ownerGid: string | undefined,
        from?: boolean,
    ) => {
        const defaultListUuids = defaultList?.map((item) => item.configurationItem?.uuid ?? '') || []
        const { notInList1, notInList2 } = splitList(defaultListUuids, currentList)

        notInList1.forEach(async (itemId) => {
            const relCode = await generateRelCode(relationType)
            createRelations({
                data: {
                    type: relationType,
                    startUuid: from ? itemId : updateCiItemId,
                    uuid: uuidV4(),
                    endUuid: from ? updateCiItemId : itemId,
                    owner: ownerGid,
                    attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCode.code as unknown as AttributeUiValue }],
                },
            })
        })

        notInList2.forEach((itemId) => {
            const dataItem = defaultList?.find((item) => item.configurationItem?.uuid === itemId)
            invalidateRelations({
                data: {
                    type: relationType,
                    uuid: dataItem?.relationship?.uuid,
                    startUuid: from ? itemId : updateCiItemId,
                    endUuid: from ? updateCiItemId : dataItem?.configurationItem?.uuid,
                    invalidateReason: {
                        comment: defaultInvalidateReasonMessage,
                    },
                },
                params: {
                    newState: [INVALIDATED],
                },
            })
        })
    }

    const handleDataItemSubmit = async (formData: RefDataItemFormType) => {
        const { ownerRoleGid, uuid } = await updateCiItem(formData)

        if (defaultDataItemPO?.configurationItem?.uuid !== formData[RefCatalogFormTypeEnum.PO]) {
            createNewRelation(RELATION_TYPE.PO_je_gestor_DatovyPrvok, defaultDataItemPO, formData[RefCatalogFormTypeEnum.PO], uuid, ownerRoleGid)
        }
        createNewRelationList(
            RELATION_TYPE.DatovyPrvok_sa_sklada_DatovyPrvok,
            defaultDataItemTemplateUriList,
            formData[RefDataItemFormTypeEnum.DATA_ITEM],
            ownerRoleGid,
        )
        invalidateCache()
    }
    const handleDatasetSubmit = async (formData: RefDatasetFormType) => {
        if (
            ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu] !==
            formData.attributes[ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu]
        ) {
            const isExisting = await checkUriIfExist(
                ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri,
                formData.attributes[ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu],
            )
            if (isExisting) {
                return setIsUriExist(true)
            }
        }

        const { ownerRoleGid, uuid } = await updateCiItem(formData)

        if (defaultDatasetZC?.configurationItem?.uuid !== formData[RefDatasetFormTypeEnum.DATA_CODE]) {
            createNewRelation(
                RELATION_TYPE.URIDataset_definuje_uri_ZC,
                defaultDatasetZC,
                uuid,
                formData[RefDatasetFormTypeEnum.DATA_CODE],
                ownerRoleGid,
            )
        }
        if (defaultDatasetItem?.configurationItem?.uuid !== formData[RefDatasetFormTypeEnum.DATA_ITEM]) {
            createNewRelation(
                RELATION_TYPE.URIDataset_obsahuje_DatovyPrvok,
                defaultDatasetItem,
                uuid,
                formData[RefDatasetFormTypeEnum.DATA_ITEM],
                ownerRoleGid,
            )
        }
        invalidateCache()
    }
    const handleTemplateUriSubmit = async (formData: RefTemplateUriFormType) => {
        if (
            ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri] !== formData.attributes[ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri]
        ) {
            const isExisting = await checkUriIfExist(
                ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri,
                formData.attributes[ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri],
            )
            if (isExisting) {
                return setIsUriExist(true)
            }
        }
        const { ownerRoleGid, uuid } = await updateCiItem(formData)

        if (defaultTemplateUri?.configurationItem?.uuid !== formData[RefTemplateUriFormTypeEnum.TEMPLATE_URI]) {
            createNewRelation(
                RELATION_TYPE.Individuum_je_typu_DatovyPrvok,
                defaultTemplateUri,
                uuid,
                formData[RefTemplateUriFormTypeEnum.TEMPLATE_URI],
                ownerRoleGid,
            )
        }
        invalidateCache()
    }

    const handleCatalogSubmit = async (formData: RefCatalogFormType) => {
        if (ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_uri] !== formData.attributes[ATTRIBUTE_NAME.Profil_URIKatalog_uri]) {
            const isExisting = await checkUriIfExist(ATTRIBUTE_NAME.Profil_URIKatalog_uri, formData.attributes[ATTRIBUTE_NAME.Profil_URIKatalog_uri])
            if (isExisting) {
                return setIsUriExist(true)
            }
        }
        const { ownerRoleGid, uuid } = await updateCiItem(formData)
        if (defaultCatalogPO?.configurationItem?.uuid !== formData[RefCatalogFormTypeEnum.PO]) {
            createNewRelation(RELATION_TYPE.PO_je_gestor_URIKatalog, defaultCatalogPO, formData[RefCatalogFormTypeEnum.PO], uuid, ownerRoleGid)
        }

        createNewRelationList(
            RELATION_TYPE.URIDataset_patri_URIKatalog,
            defaultDatasets,
            formData[RefCatalogFormTypeEnum.DATASET],
            ownerRoleGid,
            true,
        )
        invalidateCache()
    }

    const handleCancelRequest = () => {
        if (ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie] == 'c_stav_registracie.1') {
            setInvalid({
                data: {
                    attributes: Object.keys(ciItemData.attributes).map((key) => ({ value: ciItemData.attributes?.[key], name: key })),
                    invalidateReason: { comment: '' },
                    type: ciItemData.type,
                    uuid: ciItemData.uuid,
                },
            })
        } else {
            navigate(-1)
        }
    }

    const isDisabled = ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie] === 'c_stav_registracie.2'

    return (
        <RefIdentifierCreateView
            ciItemData={ciItemData}
            ciTypeData={ciTypeData}
            updateCiItemId={updateCiItemId}
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
            isUriExist={isUriExist}
            clearUriExist={() => setIsUriExist(false)}
            handleCancelRequest={handleCancelRequest}
            handleCatalogSubmit={handleCatalogSubmit}
            handleTemplateUriSubmit={handleTemplateUriSubmit}
            handleDataItemSubmit={handleDataItemSubmit}
            handleDatasetSubmit={handleDatasetSubmit}
            wrapperRef={wrapperRef}
            isUpdate
            isProcessedError={isProcessedError}
            isRedirectError={isRedirectError || isStoreRelationsError || isInvalidateError}
            isRedirectLoading={isRedirectLoading || isStoreRelationsLoading || isInvalidating || isCheckUriLoading}
            isStoreError={storeConfigurationItem.error}
            isTooManyFetchesError={isTooManyFetchesError}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
