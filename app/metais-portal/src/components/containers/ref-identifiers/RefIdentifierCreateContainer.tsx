import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, RELATION_TYPE, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { AttributeUiValue, useStoreConfigurationItem, useStoreRelationship } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { v4 as uuidV4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
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

export const RefIdentifierCreateContainer: React.FC = () => {
    const navigate = useNavigate()

    const [type, setType] = useState<RefIdentifierTypeEnum>(RefIdentifierTypeEnum.DatovyPrvok)
    const [isUriExist, setIsUriExist] = useState<boolean>(false)

    const {
        ciTypeData,
        attributes,
        datasetOptions,
        generatedEntityId,
        ownerOptions,
        templateUriOptions,
        dataItemTypeOptions,
        groupDataFiltered,
        isLoading: isRefLoading,
        isError: isRefError,
        checkUriIfExist,
        isCheckUriLoading,
    } = useRefIdentifierHook(type)

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
                    getRequestStatus(successData.requestId, () => onStatusSuccess({ configurationItemId, isUpdate: false, entityName: type }))
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    const { isLoading: isStoreRelationsLoading, isError: isStoreRelationsError, mutateAsync: createRelations } = useStoreRelationship()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (!(isRedirectError || isProcessedError || isRedirectLoading)) {
            scrollToMutationFeedback()
        }
    }, [isProcessedError, isRedirectError, isRedirectLoading, scrollToMutationFeedback])

    const isLoading = [isRefLoading].some((item) => item)
    const isError = [isRefError].some((item) => item)

    const createCiItem = async (formData: FieldValues, isSend: boolean) => {
        const registrationState = isSend ? 'c_stav_registracie.4' : 'c_stav_registracie.1'
        const owner = groupDataFiltered.find((item) => item.orgId === formData[RefCatalogFormTypeEnum.OWNER])
        const ownerRoleGid = owner?.roles.find((role) => role.roleName == 'REFID_URI_DEF')?.gid
        const attributeList = {
            ...formData.attributes,
            [ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie]: registrationState,
            [ATTRIBUTE_NAME.Gen_Profil_kod_metais]: generatedEntityId?.cicode,
            [ATTRIBUTE_NAME.Gen_Profil_ref_id]: generatedEntityId?.ciurl,
        }
        const uuid = await onSubmit({
            formData: attributeList,
            storeCiItem: storeConfigurationItem.mutateAsync,
            ownerId: ownerRoleGid,
            generatedEntityId,
        })

        return { ownerRoleGid, uuid }
    }

    const generateRelCode = useGenerateCodeHook()
    const handleTemplateUriSubmit = async (formData: RefTemplateUriFormType, isSend: boolean) => {
        const isExisting = await checkUriIfExist(
            ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri,
            formData.attributes[ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri],
        )
        if (isExisting) {
            return setIsUriExist(true)
        }
        const { ownerRoleGid, uuid } = await createCiItem(formData, isSend)
        const relCode = await generateRelCode(RELATION_TYPE.Individuum_je_typu_DatovyPrvok)
        await createRelations({
            data: {
                type: RELATION_TYPE.Individuum_je_typu_DatovyPrvok,
                startUuid: uuid,
                uuid: uuidV4(),
                endUuid: formData[RefTemplateUriFormTypeEnum.TEMPLATE_URI],
                owner: ownerRoleGid,
                attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCode.code as unknown as AttributeUiValue }],
            },
        })
    }

    const handleDatasetSubmit = async (formData: RefDatasetFormType, isSend: boolean) => {
        const isExisting = await checkUriIfExist(
            ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu,
            formData.attributes[ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu],
        )
        if (isExisting) {
            return setIsUriExist(true)
        }
        const { ownerRoleGid, uuid } = await createCiItem(formData, isSend)

        const relCodeZC = await generateRelCode(RELATION_TYPE.URIDataset_definuje_uri_ZC)
        await createRelations({
            data: {
                type: RELATION_TYPE.URIDataset_definuje_uri_ZC,
                startUuid: uuid,
                uuid: uuidV4(),
                endUuid: formData[RefDatasetFormTypeEnum.DATA_CODE],
                owner: ownerRoleGid,
                attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCodeZC.code as unknown as AttributeUiValue }],
            },
        })
        const relCodeDataPrvok = await generateRelCode(RELATION_TYPE.URIDataset_obsahuje_DatovyPrvok)
        await createRelations({
            data: {
                type: RELATION_TYPE.URIDataset_obsahuje_DatovyPrvok,
                startUuid: uuid,
                uuid: uuidV4(),
                endUuid: formData[RefDatasetFormTypeEnum.DATA_ITEM],
                owner: ownerRoleGid,
                attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCodeDataPrvok.code as unknown as AttributeUiValue }],
            },
        })
    }
    const handleDataItemSubmit = async (formData: RefDataItemFormType, isSend: boolean) => {
        const { ownerRoleGid, uuid } = await createCiItem(formData, isSend)
        const relCodeGestor = await generateRelCode(RELATION_TYPE.PO_je_gestor_DatovyPrvok)
        await createRelations({
            data: {
                type: RELATION_TYPE.PO_je_gestor_DatovyPrvok,
                startUuid: formData[RefDataItemFormTypeEnum.PO],
                uuid: uuidV4(),
                endUuid: uuid,
                owner: ownerRoleGid,
                attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCodeGestor.code as unknown as AttributeUiValue }],
            },
        })

        formData[RefDataItemFormTypeEnum.DATA_ITEM].forEach(async (itemId) => {
            const relCodeSklada = await generateRelCode(RELATION_TYPE.DatovyPrvok_sa_sklada_DatovyPrvok)
            createRelations({
                data: {
                    type: RELATION_TYPE.DatovyPrvok_sa_sklada_DatovyPrvok,
                    startUuid: uuid,
                    uuid: uuidV4(),
                    endUuid: itemId,
                    owner: ownerRoleGid,
                    attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCodeSklada.code as unknown as AttributeUiValue }],
                },
            })
        })
    }

    const handleCatalogSubmit = async (formData: RefCatalogFormType, isSend: boolean) => {
        setIsUriExist(true)
        const isExisting = await checkUriIfExist(ATTRIBUTE_NAME.Profil_URIKatalog_uri, formData.attributes[ATTRIBUTE_NAME.Profil_URIKatalog_uri])
        if (isExisting) {
            return setIsUriExist(true)
        }

        const { ownerRoleGid, uuid } = await createCiItem(formData, isSend)
        const relCodeKatalogGestor = await generateRelCode(RELATION_TYPE.PO_je_gestor_URIKatalog)
        await createRelations({
            data: {
                type: RELATION_TYPE.PO_je_gestor_URIKatalog,
                startUuid: formData[RefCatalogFormTypeEnum.PO],
                uuid: uuidV4(),
                endUuid: uuid,
                owner: ownerRoleGid,
                attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCodeKatalogGestor.code as unknown as AttributeUiValue }],
            },
        })
        formData[RefCatalogFormTypeEnum.DATASET].forEach(async (itemId) => {
            const relCodeKatalogPatri = await generateRelCode(RELATION_TYPE.URIDataset_patri_URIKatalog)
            await createRelations({
                data: {
                    type: RELATION_TYPE.URIDataset_patri_URIKatalog,
                    startUuid: itemId,
                    uuid: uuidV4(),
                    endUuid: uuid,
                    owner: ownerRoleGid,
                    attributes: [{ name: ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, value: relCodeKatalogPatri.code as unknown as AttributeUiValue }],
                },
            })
        })
    }

    const handleCancelRequest = () => {
        navigate(-1)
    }

    return (
        <RefIdentifierCreateView
            ciTypeData={ciTypeData}
            groupData={groupDataFiltered}
            generatedEntityId={generatedEntityId}
            attributes={attributes}
            ownerOptions={ownerOptions}
            datasetOptions={datasetOptions}
            templateUriOptions={templateUriOptions}
            dataItemTypeOptions={dataItemTypeOptions}
            type={type}
            ciCode={generatedEntityId?.cicode}
            setType={setType}
            handleCancelRequest={handleCancelRequest}
            handleDataItemSubmit={handleDataItemSubmit}
            handleTemplateUriSubmit={handleTemplateUriSubmit}
            handleCatalogSubmit={handleCatalogSubmit}
            handleDatasetSubmit={handleDatasetSubmit}
            wrapperRef={wrapperRef}
            isUriExist={isUriExist}
            clearUriExist={() => setIsUriExist(false)}
            isUpdate={false}
            isProcessedError={isProcessedError}
            isRedirectError={isRedirectError || isStoreRelationsError}
            isRedirectLoading={isRedirectLoading || isStoreRelationsLoading || isCheckUriLoading}
            isStoreError={storeConfigurationItem.error}
            isTooManyFetchesError={isTooManyFetchesError}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
