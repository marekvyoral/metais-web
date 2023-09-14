import {
    ClaimDecisionData,
    ClaimDecisionDataAction,
    ClaimEvent,
    ClaimEventType,
    ClaimUi,
    useProcessEvent,
    useRead,
} from '@isdd/metais-common/api/generated/claim-manager-swagger'
import {
    FindAll11200,
    IdentityWithOnePoAndRolesWithoutAuthResource,
    useDetachDelete,
    useFindAll11,
    useUpdateIdentityState,
    useUpdateWithOnePoAndRoles,
} from '@isdd/metais-common/api/generated/iam-swagger'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RoleItem } from '@/components/views/userManagement/request-list-view/request-detail/RequestRolesForm'

export interface IRequestRoleData {
    roleGroupsData: EnumType | undefined
    allRolesData: FindAll11200 | undefined
}
export interface IUserDetailContainerView {
    data?: ClaimUi
    roleData: IRequestRoleData
    isLoading: boolean
    isSuccess: boolean
    errorMessage: string
    handleApproveClick: (selectedRoles: RoleItem[], request?: ClaimUi, anonymize?: boolean) => void
    handleDeleteClick: (request?: ClaimUi) => void
    handleRefuseModalClick: (text: string) => void
    isError: boolean
}
interface IGdprRequestDetailContainer {
    userId: string
    View: React.FC<IUserDetailContainerView>
}

export const GdprRequestDetailContainer: React.FC<IGdprRequestDetailContainer> = ({ userId, View }) => {
    const navigate = useNavigate()
    const SKUPINA_ROL = 'SKUPINA_ROL'
    const anonymizovane = 'Anonymizované'

    const { isLoading: isLoadingRequest, isError: isErrorRequest, data } = useRead(userId)
    const { data: roleGroupsData, isLoading: isRoleGroupsLoading, isError: isRoleGroupsError } = useGetValidEnum(SKUPINA_ROL)
    const { data: allRolesData, isLoading: isAllRolesLoading, isError: isAllRolesError } = useFindAll11()
    const { mutateAsync: mutateAsyncUpdateIdentity, isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate } = useUpdateIdentityState()
    const { mutateAsync: mutateAsyncDelete } = useDetachDelete()
    const { mutateAsync: mutateAsyncApprove, isSuccess, isLoading: IsLoadingUpdatePo, isError: isErrorUpdatePo } = useUpdateWithOnePoAndRoles()
    const { mutateAsync: processEventMutationAsync, isSuccess: isSuccessPE, isLoading: isLoadingPE, isError: isErrorPe } = useProcessEvent()
    const [errorMessage, setErrorMessage] = useState('')

    const isLoading = [isLoadingRequest, isAllRolesLoading, isRoleGroupsLoading, isLoadingUpdate, IsLoadingUpdatePo, isLoadingPE].some((item) => item)
    const isError = [isErrorRequest, isAllRolesError, isRoleGroupsError, isErrorPe, isErrorUpdatePo].some((item) => item)

    const handleApprove = useCallback(
        async (selectedRoles: RoleItem[], request?: ClaimUi, anonymize?: boolean) => {
            const anonymizedEmail = !anonymize ? request?.email : anonymizovane + Date.now() + '@' + request?.email?.split('@')[1]
            const dataApprove: IdentityWithOnePoAndRolesWithoutAuthResource = {
                orgId: request?.po,
                roleIds: selectedRoles?.map((item) => item.uuid) || [],
                identity: {
                    uuid: request?.createdBy,
                    firstName: request?.identityFirstName && (!anonymize ? request?.identityFirstName : anonymizovane),
                    lastName: request?.identityLastName && (!anonymize ? request?.identityLastName : anonymizovane),
                    login: request?.identityLogin && (!anonymize ? request?.identityLogin : anonymizovane + Date.now()),
                    email: request?.email && anonymizedEmail,
                    phone: request?.telephone && (!anonymize ? request?.telephone : anonymizovane),
                    mobile: request?.mobile && (!anonymize ? request?.mobile : anonymizovane),
                    position: request?.position && (!anonymize ? request?.position : anonymizovane),
                },
            }

            await mutateAsyncApprove({
                data: {
                    ...dataApprove,
                },
            }).then(async () => {
                const approve: ClaimEvent = {
                    type: ClaimEventType.DECISION_EVENT,
                    claimDecisionData: { action: ClaimDecisionDataAction.ACCEPT, uuid: userId },
                }
                await mutateAsyncUpdateIdentity({ data: { ...dataApprove.identity } })
                    .then(async () => {
                        await processEventMutationAsync({
                            data: {
                                ...approve,
                            },
                        })
                            .then(() => {
                                navigate(`${AdminRouteNames.GDPR_REQUEST_LIST}`)
                            })
                            .catch((error) => {
                                setErrorMessage(error.message)
                            })
                    })
                    .catch((error) => {
                        setErrorMessage(error.message)
                    })
            })
        },
        [mutateAsyncApprove, mutateAsyncUpdateIdentity, navigate, processEventMutationAsync, userId],
    )

    const handleRefuseModal = useCallback(
        async (text: string) => {
            const refuse: ClaimEvent = {
                type: ClaimEventType.DECISION_EVENT,
                claimDecisionData: { action: ClaimDecisionDataAction.REFUSE, decisionReason: text, uuid: userId } as ClaimDecisionData,
            }

            await processEventMutationAsync({
                data: {
                    ...refuse,
                },
            })
                .then(() => {
                    navigate(`${AdminRouteNames.GDPR_REQUEST_LIST}`)
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                })
        },
        [navigate, processEventMutationAsync, userId],
    )

    const handleDelete = useCallback(
        (request?: ClaimUi) => {
            mutateAsyncDelete({
                uuid: request?.createdBy || '',
            })
                .then(() => {
                    navigate(`${AdminRouteNames.GDPR_REQUEST_LIST}`)
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                })
        },
        [mutateAsyncDelete, navigate],
    )

    return (
        <View
            data={data}
            roleData={{ roleGroupsData, allRolesData }}
            isLoading={isLoading || isLoadingPE || isLoadingUpdate}
            isError={isError || isErrorPe || isErrorUpdatePo}
            handleApproveClick={handleApprove}
            handleDeleteClick={handleDelete}
            errorMessage={errorMessage}
            isSuccess={isSuccess || isSuccessUpdate || isSuccessPE}
            handleRefuseModalClick={handleRefuseModal}
        />
    )
}
