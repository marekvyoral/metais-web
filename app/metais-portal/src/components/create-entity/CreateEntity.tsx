import { ConfigurationItemUiAttributes, useStoreConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { CiCode, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { CreateCiEntityForm } from './CreateCiEntityForm'
import { useCiCreateEditOnStatusSuccess, useCiCreateUpdateOnSubmit } from './createEntityHelpers'

import { PublicAuthorityState, RoleState } from '@/hooks/usePublicAuthorityAndRole.hook'

export interface AttributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType
}

export interface CreateEntityData {
    attributesData: AttributesData
    generatedEntityId: CiCode | undefined
    ownerId?: string
}

interface ICreateEntity {
    entityName: string
    data: CreateEntityData
    roleState?: RoleState
    publicAuthorityState?: PublicAuthorityState
    updateCiItemId?: string
    defaultItemAttributeValues?: ConfigurationItemUiAttributes
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
    const isUpdate = !!updateCiItemId

    const { attributesData, generatedEntityId } = data
    const { constraintsData, ciTypeData, unitsData } = attributesData

    const onStatusSuccess = useCiCreateEditOnStatusSuccess()
    const { isError: isRedirectError, isLoading: isRedirectLoading, isProcessedError, getRequestStatus, isTooManyFetchesError } = useGetStatus()
    const { onSubmit, uploadError, setUploadError, configurationItemId } = useCiCreateUpdateOnSubmit(entityName)
    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            async onSuccess(successData) {
                if (successData.requestId != null) {
                    await getRequestStatus(successData.requestId, () => onStatusSuccess({ configurationItemId, isUpdate, entityName }))
                } else {
                    setUploadError(true)
                }
            },
        },
    })
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (!(isRedirectError || isProcessedError || isRedirectLoading) || isTooManyFetchesError) {
            scrollToMutationFeedback()
        }
    }, [isProcessedError, isRedirectError, isRedirectLoading, isTooManyFetchesError, scrollToMutationFeedback])

    return (
        <>
            <MutationFeedback error={storeConfigurationItem.isError} errorMessage={t('createEntity.mutationError')} />

            <QueryFeedback
                loading={isRedirectLoading}
                error={isRedirectError || isProcessedError || isTooManyFetchesError}
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
                <div ref={wrapperRef} />
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
                    entityName={entityName}
                    ciTypeData={ciTypeData}
                    generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                    constraintsData={constraintsData}
                    unitsData={unitsData}
                    uploadError={uploadError}
                    onSubmit={(formData) =>
                        onSubmit({
                            formData,
                            updateCiItemId,
                            storeCiItem: storeConfigurationItem.mutateAsync,
                            ownerId: data.ownerId,
                            generatedEntityId,
                        })
                    }
                    defaultItemAttributeValues={defaultItemAttributeValues}
                    updateCiItemId={updateCiItemId}
                    isProcessing={storeConfigurationItem.isLoading}
                    selectedRole={roleState?.selectedRole ?? null}
                />
            </QueryFeedback>
        </>
    )
}
