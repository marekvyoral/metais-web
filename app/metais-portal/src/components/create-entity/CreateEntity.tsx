import { ConfigurationItemUiAttributes, useStoreConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useRedirectAfterSuccess } from '@isdd/metais-common/src/hooks/useRedirectAfterSucces'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'
import { CiType, CiCode } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useDeleteCacheForCi } from '@isdd/metais-common/src/hooks/be-cache/useDeleteCacheForCi'
import { isObjectEmpty } from '@isdd/metais-common/src/utils/utils'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useLocation, useNavigate } from 'react-router-dom'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useInvalidateCiItemCache, useInvalidateCiListFilteredCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { CreateCiEntityForm } from './CreateCiEntityForm'
import { formatFormAttributeValue } from './createEntityHelpers'

import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'

export interface AttrributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType | undefined
}

export interface CreateEntityData {
    attributesData: AttrributesData
    generatedEntityId: CiCode | undefined
    ownerId?: string
}

interface ICreateEntity {
    entityName: string
    data: CreateEntityData
    roleState?: RoleState
    publicAuthorityState?: PublicAuthorityState
    updateCiItemId?: string
    defaultItemAttributeValues?: ConfigurationItemUiAttributes | undefined
}

export const CreateEntity: React.FC<ICreateEntity> = ({
    data,
    entityName,
    updateCiItemId,
    defaultItemAttributeValues,
    roleState,
    publicAuthorityState,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const isUpdate = !!updateCiItemId

    const { attributesData, generatedEntityId } = data
    const { constraintsData, ciTypeData, unitsData } = attributesData

    const [uploadError, setUploadError] = useState(false)
    const [requestId, setRequestId] = useState<string>('')
    const [configurationItemId, setConfigurationItemId] = useState<string>('')

    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess(successData) {
                if (successData.requestId != null) {
                    setRequestId(successData.requestId)
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    const invalidateCilistFilteredCache = useInvalidateCiListFilteredCache()
    const invalidateCiByUuidCache = useInvalidateCiItemCache()

    const onRedirectSuccess = () => {
        const toPath = `/ci/${entityName}/${configurationItemId}`
        invalidateCilistFilteredCache.invalidate({ ciType: entityName })
        invalidateCiByUuidCache.invalidate(configurationItemId)
        setIsActionSuccess({ value: true, path: toPath, type: isUpdate ? 'edit' : 'create' })
        navigate(toPath, { state: { from: location } })
    }

    const {
        performRedirection,
        reset: resetRedirect,
        isLoading: isRedirectLoading,
        isError: isRedirectError,
        isFetched: isRedirectFetched,
        isProcessedError,
        isTooManyFetchesError,
    } = useRedirectAfterSuccess({ requestId, onSuccess: onRedirectSuccess })

    useEffect(() => {
        if (requestId != null) {
            performRedirection()
        }
    }, [performRedirection, requestId])

    const deleteCacheMutation = useDeleteCacheForCi(entityName)

    const onSubmit = async (formAttributes: FieldValues) => {
        setRequestId('')
        setUploadError(false)
        resetRedirect()
        const formAttributesKeys = Object.keys(formAttributes)

        const formattedAttributesToSend = formAttributesKeys
            .map((key) => ({
                name: key,
                value: formatFormAttributeValue(formAttributes, key),
            }))
            .filter((att) => !isObjectEmpty(att.value))

        const type = entityName
        const ownerId = data.ownerId
        const uuid = isUpdate ? updateCiItemId : uuidV4()
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

        const handleStoreConfigurationItem = () => {
            storeConfigurationItem.mutate({
                data: isUpdate ? dataToUpdate : dataToCreate,
            })
        }

        deleteCacheMutation.mutateAsync(undefined, {
            onSuccess: () => handleStoreConfigurationItem(),
        })
    }

    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (!(isRedirectError || isProcessedError || isRedirectLoading)) {
            scrollToMutationFeedback()
        }
    }, [isProcessedError, isRedirectError, isRedirectLoading, scrollToMutationFeedback])

    return (
        <>
            {!(isRedirectError || isProcessedError || isRedirectLoading) && (
                <div ref={wrapperRef}>
                    <MutationFeedback success={false} error={storeConfigurationItem.isError ? t('createEntity.mutationError') : ''} />
                </div>
            )}
            <QueryFeedback
                loading={isRedirectFetched && isRedirectLoading}
                error={isRedirectFetched && (isRedirectError || isProcessedError || isTooManyFetchesError)}
                indicatorProps={{
                    label: isUpdate ? t('createEntity.redirectLoadingEdit') : t('createEntity.redirectLoading'),
                }}
                errorProps={{
                    errorMessage: isTooManyFetchesError
                        ? t('createEntity.tooManyFetchesError')
                        : isUpdate
                        ? t('createEntity.redirectErrorEdit')
                        : t('createEntity.redirectError'),
                }}
                withChildren
            >
                {!isUpdate && publicAuthorityState && roleState && (
                    <SelectPublicAuthorityAndRole
                        selectedRole={roleState.selectedRole ?? {}}
                        onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                        onChangeRole={roleState.setSelectedRole}
                        selectedOrg={publicAuthorityState.selectedPublicAuthority}
                        ciRoles={ciTypeData?.roleList ?? []}
                    />
                )}

                <CreateCiEntityForm
                    ciTypeData={ciTypeData}
                    generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                    constraintsData={constraintsData}
                    unitsData={unitsData}
                    uploadError={uploadError}
                    onSubmit={onSubmit}
                    defaultItemAttributeValues={defaultItemAttributeValues}
                    updateCiItemId={updateCiItemId}
                    isProcessing={storeConfigurationItem.isLoading}
                    selectedRole={roleState?.selectedRole ?? null}
                />
            </QueryFeedback>
        </>
    )
}
