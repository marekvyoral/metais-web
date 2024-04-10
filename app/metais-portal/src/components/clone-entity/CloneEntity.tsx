import { SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi, ConfigurationItemUiAttributes, useStoreGraph } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiCode, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { isObjectEmpty } from '@isdd/metais-common/src/utils/utils'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'

import { createSimpleSelectRelationTypeOptions } from '@/componentHelpers/new-relation'
import { ICiTypeRelationData, ISelectedRelationTypeState } from '@/components/containers/CiCloneContainer'
import { PublicAuthorityState, RoleState } from '@/hooks/usePublicAuthorityAndRole.hook'
import { CreateCiEntityForm } from '@/components/create-entity/CreateCiEntityForm'
import { formatFormAttributeValue } from '@/components/create-entity/createEntityHelpers'
import { useRolesForPO } from '@/hooks/useRolesForPO'

export interface AttributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType
}

export interface CloneEntityData {
    attributesData: AttributesData
    generatedEntityId: CiCode | undefined
    relationData: ICiTypeRelationData
    ciItemData: ConfigurationItemUi | undefined
}

interface ICloneEntity {
    entityName: string
    data: CloneEntityData
    roleState?: RoleState
    publicAuthorityState?: PublicAuthorityState
    cloneCiItemId?: string
    selectedRelationTypeState: ISelectedRelationTypeState
    defaultItemAttributeValues?: ConfigurationItemUiAttributes
}

export const CloneEntity: React.FC<ICloneEntity> = ({
    data,
    entityName,
    cloneCiItemId,
    defaultItemAttributeValues,
    roleState,
    publicAuthorityState,
    selectedRelationTypeState,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const { attributesData, generatedEntityId, relationData, ciItemData } = data
    const { constraintsData, ciTypeData, unitsData } = attributesData
    const { relatedList } = relationData
    const { selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName } = selectedRelationTypeState

    const { rolesForPO, isRightsForPOError } = useRolesForPO(publicAuthorityState?.selectedPublicAuthority?.poUUID ?? '', ciTypeData?.roleList ?? [])

    const [uploadError, setUploadError] = useState(false)
    const [configurationItemId, setConfigurationItemId] = useState<string>('')

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    const addOrGetGroupHook = useAddOrGetGroupHook()

    const onStatusSuccess = () => {
        const toPath = `/ci/${entityName}/${configurationItemId}`
        setIsActionSuccess({ value: true, path: toPath, additionalInfo: { type: 'clone' } })
        navigate(toPath, { state: { from: location } })
    }

    const { getRequestStatus, isTooManyFetchesError, isProcessedError, isError: isRedirectError, isLoading: isRedirectLoading } = useGetStatus()

    const storeConfigurationItem = useStoreGraph({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess(successData) {
                if (successData.requestId != null) {
                    getRequestStatus(successData.requestId, onStatusSuccess)
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    useEffect(() => {
        if (!(isRedirectError || isProcessedError || isRedirectLoading)) {
            scrollToMutationFeedback()
        }
    }, [isProcessedError, isRedirectError, isRedirectLoading, scrollToMutationFeedback])

    const onSubmit = async (formAttributes: FieldValues) => {
        setUploadError(false)
        const formAttributesKeys = Object.keys(formAttributes)

        const formattedAttributesToSend = formAttributesKeys
            .map((key) => ({
                name: key,
                value: formatFormAttributeValue(formAttributes, key),
            }))
            .filter((att) => !isObjectEmpty(att.value))

        const uuid = cloneCiItemId ? cloneCiItemId : uuidV4()
        setConfigurationItemId(uuid)

        addOrGetGroupHook(roleState?.selectedRole?.roleUuid ?? '', publicAuthorityState?.selectedPublicAuthority?.poUUID ?? '').then((groupData) => {
            const ciUuid = uuidV4()
            const relationUuid = uuidV4()
            const request = {
                storeSet: {
                    configurationItemSet: [
                        {
                            type: ciItemData?.type,
                            uuid: ciUuid,
                            owner: groupData.gid,
                            attributes: formattedAttributesToSend,
                        },
                    ],
                    relationshipSet: [
                        {
                            type: selectedRelationTypeTechnicalName,
                            uuid: relationUuid,
                            owner: groupData.gid,
                            startUuid: cloneCiItemId,
                            endUuid: ciUuid,
                            attributes: [],
                        },
                    ],
                },
            }

            const handleStoreConfigurationItem = () => {
                storeConfigurationItem.mutate({
                    data: request,
                })
            }

            handleStoreConfigurationItem()
        })
    }

    return (
        <>
            <div ref={wrapperRef}>
                <MutationFeedback error={storeConfigurationItem.isError} />
            </div>
            <QueryFeedback
                loading={isRedirectLoading}
                error={isRedirectError || isProcessedError || isTooManyFetchesError || isRightsForPOError}
                indicatorProps={{
                    label: cloneCiItemId ? t('createEntity.redirectLoadingEdit') : t('createEntity.redirectLoading'),
                }}
                errorProps={{
                    errorMessage: isTooManyFetchesError
                        ? t('createEntity.tooManyFetchesError')
                        : cloneCiItemId
                        ? t('createEntity.redirectErrorEdit')
                        : t('createEntity.redirectError'),
                }}
                withChildren
            >
                {publicAuthorityState && roleState && (
                    <>
                        <SelectPublicAuthorityAndRole
                            selectedRole={roleState.selectedRole ?? {}}
                            onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                            onChangeRole={roleState.setSelectedRole}
                            selectedOrg={publicAuthorityState.selectedPublicAuthority}
                            ciRoles={ciTypeData?.roleList ?? []}
                        />
                    </>
                )}

                <SimpleSelect
                    isClearable={false}
                    label={t('newRelation.selectRelType')}
                    name="relation-type"
                    options={createSimpleSelectRelationTypeOptions({
                        relatedList,
                    })}
                    value={selectedRelationTypeTechnicalName}
                    onChange={(val) => setSelectedRelationTypeTechnicalName(val ?? '')}
                />

                <CreateCiEntityForm
                    entityName={entityName}
                    ciTypeData={ciTypeData}
                    generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                    constraintsData={constraintsData}
                    unitsData={unitsData}
                    uploadError={uploadError}
                    onSubmit={onSubmit}
                    defaultItemAttributeValues={defaultItemAttributeValues}
                    updateCiItemId={cloneCiItemId}
                    isProcessing={storeConfigurationItem.isLoading}
                    selectedRole={roleState?.selectedRole ?? null}
                    rolesForPO={rolesForPO ?? []}
                />
            </QueryFeedback>
        </>
    )
}
