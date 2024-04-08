import { ConfigurationItemUiAttributes, useStoreConfigurationItem, useStoreGraph } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { ATTRIBUTE_NAME, MutationFeedback, PROJECT_STATE_ENUM, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CiType, CiCode } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { Program_financuje_Projekt, ROLES } from '@isdd/metais-common/constants'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { v4 as uuidV4 } from 'uuid'
import { useGetProgramPartFinanceHook } from '@isdd/metais-common/api/generated/kris-swagger'
import { FieldValues } from 'react-hook-form'

import { PublicAuthorityState, RoleState } from '@/hooks/usePublicAuthorityAndRole.hook'
import { useCiCreateEditOnStatusSuccess, useCiCreateUpdateOnSubmit } from '@/components/create-entity/createEntityHelpers'
import { CreateCiEntityForm } from '@/components/create-entity/CreateCiEntityForm'
import { useRolesForPO } from '@/hooks/useRolesForPO'

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

const DISABLED_EDIT_ATTRIBUTE_LIST: string[] = [
    ATTRIBUTE_NAME.EA_Profil_Projekt_program,
    ATTRIBUTE_NAME.EA_Profil_Projekt_typ_investicie,
    ATTRIBUTE_NAME.Financny_Profil_Projekt_rocne_naklady,
    ATTRIBUTE_NAME.Financny_Profil_Projekt_suma_vydavkov,
]

export const CreateProjectEntity: React.FC<ICreateEntity> = ({
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

    const { rolesForPO, isRightsForPOError } = useRolesForPO(
        updateCiItemId ? data.ownerId ?? '' : publicAuthorityState?.selectedPublicAuthority?.poUUID ?? '',
        ciTypeData?.roleList ?? [],
    )

    const modifiedCiTypeData = useMemo(() => {
        if (isUpdate) {
            const type = defaultItemAttributeValues?.[ATTRIBUTE_NAME.EA_Profil_Projekt_status]
            if (type !== PROJECT_STATE_ENUM.c_stav_projektu_1) {
                const profiles = ciTypeData?.attributeProfiles?.map((profile) => {
                    const attributes = profile.attributes?.map((attribute) => {
                        if (DISABLED_EDIT_ATTRIBUTE_LIST.includes(attribute.technicalName ?? '')) {
                            return { ...attribute, readOnly: true }
                        }
                        return attribute
                    })
                    return { ...profile, attributes }
                })
                return { ...ciTypeData, attributeProfiles: profiles }
            }
        }
        return ciTypeData
    }, [ciTypeData, defaultItemAttributeValues, isUpdate])

    const onStatusSuccess = useCiCreateEditOnStatusSuccess()
    const { isError: isRedirectError, isLoading: isRedirectLoading, isProcessedError, getRequestStatus, isTooManyFetchesError } = useGetStatus()
    const { onSubmit, uploadError, setUploadError, configurationItemId } = useCiCreateUpdateOnSubmit(entityName)
    const getApprovalProcess = useGetProgramPartFinanceHook()

    const storeGraph = useStoreGraph({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess(successData) {
                if (successData.requestId != null) {
                    getRequestStatus(successData.requestId, () => onStatusSuccess({ configurationItemId, isUpdate, entityName }))
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            onSuccess(successData, variables) {
                if (successData.requestId != null) {
                    if (isUpdate) {
                        getRequestStatus(successData.requestId, () => onStatusSuccess({ configurationItemId, isUpdate, entityName }))
                    } else {
                        getRequestStatus(successData.requestId, () => {
                            const attributes = variables.data.attributes as { value: string; name: string }[]
                            const programUuid = attributes?.find(
                                (att: { value: string; name: string }) => att?.name === ATTRIBUTE_NAME.EA_Profil_Projekt_program,
                            )?.value

                            storeGraph.mutateAsync({
                                data: {
                                    storeSet: {
                                        relationshipSet: [
                                            {
                                                type: Program_financuje_Projekt,
                                                uuid: uuidV4(),
                                                startUuid: programUuid,
                                                endUuid: variables.data.uuid,
                                                owner: variables.data.owner,
                                                attributes: [],
                                            },
                                        ],
                                    },
                                },
                            })
                        })
                    }
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    const checkApprovalProcessAndSubmit = async (formData: FieldValues) => {
        const resp = await getApprovalProcess(formData['EA_Profil_Projekt_program'], {
            projectType: formData['EA_Profil_Projekt_typ_investicie'],
            financialValue: formData['Financny_Profil_Projekt_suma_vydavkov'],
        })
        formData['EA_Profil_Projekt_schvalovaci_proces'] = resp.approvalProcess?.technicalName

        onSubmit({
            formData,
            updateCiItemId,
            storeCiItem: storeConfigurationItem.mutateAsync,
            ownerId: data.ownerId,
            generatedEntityId,
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
            <div ref={wrapperRef}>
                <MutationFeedback error={storeConfigurationItem.isError} />
            </div>
            <QueryFeedback
                loading={isRedirectLoading}
                error={isRedirectError || isProcessedError || isTooManyFetchesError || isRightsForPOError}
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
                        ciRoles={[ROLES.EA_GARPO, ROLES.R_EGOV, ROLES.R_ADMIN]}
                        disableRoleSelect
                    />
                )}

                <CreateCiEntityForm
                    entityName={entityName}
                    ciTypeData={modifiedCiTypeData}
                    generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                    constraintsData={constraintsData}
                    unitsData={unitsData}
                    uploadError={uploadError}
                    selectedOrg={publicAuthorityState?.selectedPublicAuthority}
                    onSubmit={checkApprovalProcessAndSubmit}
                    defaultItemAttributeValues={defaultItemAttributeValues}
                    updateCiItemId={updateCiItemId}
                    isProcessing={storeConfigurationItem.isLoading}
                    selectedRole={roleState?.selectedRole ?? null}
                    rolesForPO={rolesForPO ?? []}
                />
            </QueryFeedback>
        </>
    )
}
