import { CiCode, CiType, ConfigurationItemUiAttributes, EnumType, useStoreConfigurationItem } from '@isdd/metais-common/api'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useRedirectAfterSuccess } from '@isdd/metais-common/src/hooks/useRedirectAfterSucces'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'

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
    const selectedRole = roleState?.selectedRole
    const setSelectedRole = roleState?.setSelectedRole
    const selectedPublicAuthority = publicAuthorityState?.selectedPublicAuthority
    const setSelectedPublicAuthority = publicAuthorityState?.setSelectedPublicAuthority

    const [uploadError, setUploadError] = useState(false)
    const [requestId, setRequestId] = useState<string>('')
    const [configurationItemId, setConfigurationItemId] = useState<string>('')

    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess(succesData) {
                if (succesData.requestId != null) {
                    setRequestId(succesData.requestId)
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    const {
        performRedirection,
        isLoading: isRedirectLoading,
        isError: isRedirectError,
        isFetched: isRedirectFetched,
        isProcessedError,
    } = useRedirectAfterSuccess(requestId, configurationItemId, entityName)
    useEffect(() => {
        if (requestId !== null) {
            performRedirection()
        }
    }, [performRedirection, requestId])

    const onSubmit = async (formAttributes: FieldValues) => {
        setRequestId('')
        setUploadError(false)
        const formAttributesKeys = Object.keys(formAttributes)

        const formatedAttributesToSend = formAttributesKeys.map((key) => ({
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
            attributes: formatedAttributesToSend,
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
            {!(isRedirectError || isProcessedError) && (storeConfigurationItem.isError || storeConfigurationItem.isSuccess) && (
                <MutationFeedback
                    success={storeConfigurationItem.isSuccess}
                    error={storeConfigurationItem.isError ? t('createEntity.mutationError') : ''}
                />
            )}
            {isRedirectFetched && (isRedirectLoading || isRedirectError || isProcessedError) && (
                <QueryFeedback
                    loading={isRedirectLoading}
                    error={isRedirectError || isProcessedError}
                    indicatorProps={{ fullscreen: true, layer: 'parent', label: t('createEntity.redirectLoading') }}
                    errorProps={{ errorMessage: t('createEntity.redirectError') }}
                />
            )}

            {!updateCiItemId && selectedRole && selectedPublicAuthority && setSelectedRole && setSelectedPublicAuthority && (
                <SelectPublicAuthorityAndRole
                    selectedRoleId={selectedRole}
                    onChangeAuthority={setSelectedPublicAuthority}
                    onChangeRole={setSelectedRole}
                    selectedOrg={selectedPublicAuthority}
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
            />
        </>
    )
}
