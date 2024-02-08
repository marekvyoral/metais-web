import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { useStoreConfigurationItem, useStoreRelationship } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

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

export const RefIdentifierCreateContainer: React.FC = () => {
    const [type, setType] = useState<RefIdentifierTypeEnum>(RefIdentifierTypeEnum.DatovyPrvok)

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
                    getRequestStatus(successData.requestId, () => onStatusSuccess({ configurationItemId, isUpdate: false, entityName: type }))
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

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (!(isRedirectError || isProcessedError || isRedirectLoading)) {
            scrollToMutationFeedback()
        }
    }, [isProcessedError, isRedirectError, isRedirectLoading, scrollToMutationFeedback])

    const isLoading = [isRefLoading, isStoreRelationsLoading].some((item) => item)
    const isError = [isRefError, isStoreRelationsError].some((item) => item)

    const handleCatalogSubmit = async (formData: RefCatalogFormType) => {
        const owner = groupDataFiltered.find((item) => item.orgId === formData[RefCatalogFormTypeEnum.OWNER])
        const ownerRoleGid = owner?.roles.find((role) => role.roleName == 'REFID_URI_DEF')?.gid
        const attributeList = {
            ...formData.attributes,
            [ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie]: 'c_stav_registracie.1',
            [ATTRIBUTE_NAME.Gen_Profil_kod_metais]: generatedEntityId?.cicode,
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]: formatDateForDefaultValue(formData.attributes[ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]),
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]: formatDateForDefaultValue(formData.attributes[ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]),
            [ATTRIBUTE_NAME.Gen_Profil_ref_id]: generatedEntityId?.ciurl,
        }
        const uuid = await onSubmit({
            formData: attributeList,
            storeCiItem: storeConfigurationItem.mutateAsync,
            ownerId: ownerRoleGid,
            generatedEntityId,
        })

        await createRelations({
            data: {
                type: 'PO_je_gestor_URIKatalog',
                startUuid: formData[RefCatalogFormTypeEnum.PO],
                uuid: uuidV4(),
                endUuid: uuid,
                owner: ownerRoleGid,
                attributes: [],
            },
        })
        formData[RefCatalogFormTypeEnum.DATASET].forEach((datasetId) => {
            createRelations({
                data: {
                    type: 'URIDataset_patri_URIKatalog',
                    startUuid: datasetId,
                    uuid: uuidV4(),
                    endUuid: uuid,
                    owner: ownerRoleGid,
                    attributes: [],
                },
            })
        })
    }

    return (
        <RefIdentifierCreateView
            ciTypeData={ciTypeData}
            groupData={groupDataFiltered}
            generatedEntityId={generatedEntityId}
            attributes={attributes}
            ownerOptions={ownerOptions}
            datasetOptions={datasetOptions}
            type={type}
            setType={setType}
            handleCatalogSubmit={handleCatalogSubmit}
            wrapperRef={wrapperRef}
            isUpdate={false}
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
