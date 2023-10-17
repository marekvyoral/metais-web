import { ConfigurationItemUiAttributes, EnumType, useStoreConfigurationItem } from '@isdd/metais-common/api'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useRedirectAfterSuccess } from '@isdd/metais-common/src/hooks/useRedirectAfterSucces'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'
import { CiType, CiCode } from '@isdd/metais-common/api/generated/types-repo-swagger'
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
    const { attributesData, generatedEntityId } = data
    const { constraintsData, ciTypeData, unitsData } = attributesData

    const [uploadError, setUploadError] = useState(false)
    const [requestId, setRequestId] = useState<string>('')
    const [configurationItemId, setConfigurationItemId] = useState<string>('')

    const invalidateCilistFilteredCache = useInvalidateCiListFilteredCache()
    const invalidateCiByUuidCache = useInvalidateCiItemCache(updateCiItemId ? updateCiItemId : configurationItemId)

    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess(successData) {
                if (successData.requestId != null) {
                    setRequestId(successData.requestId)
                    invalidateCilistFilteredCache.invalidate({ ciType: entityName })
                    invalidateCiByUuidCache.invalidate()
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
        setRequestId('')
        setUploadError(false)
        resetRedirect()
        const formAttributesKeys = Object.keys(formAttributes)

        const formattedAttributesToSend = formAttributesKeys.map((key) => ({
            name: key,
            value: formatFormAttributeValue(formAttributes, key),
        }))
        const type = entityName
        const ownerId = data.ownerId
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

        storeConfigurationItem.mutate({
            data: updateCiItemId ? dataToUpdate : dataToCreate,
        })
    }

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
                {!updateCiItemId && publicAuthorityState && roleState && (
                    <SelectPublicAuthorityAndRole
                        selectedRoleId={roleState.selectedRole}
                        onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                        onChangeRole={roleState.setSelectedRole}
                        selectedOrg={publicAuthorityState.selectedPublicAuthority}
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
                />
            </QueryFeedback>
        </>
    )
}
