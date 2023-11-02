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
    useFindAll11,
    useUpdateWithOnePoAndRoles,
} from '@isdd/metais-common/api/generated/iam-swagger'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
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
    errorMessage: string
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    handleApproveClick: (selectedRoles: RoleItem[], request?: ClaimUi) => void
    handleRefuseModalClick: (text: string) => void
}
interface IRequestDetailContainer {
    userId: string
    View: React.FC<IUserDetailContainerView>
}

export const RequestDetailContainer: React.FC<IRequestDetailContainer> = ({ userId, View }) => {
    const navigate = useNavigate()
    const SKUPINA_ROL = 'SKUPINA_ROL'

    const { isLoading: isLoadingRequest, isError: isErrorRequest, data } = useRead(userId)
    const { data: allRolesData, isLoading: isAllRolesLoading, isError: isAllRolesError } = useFindAll11()
    const { data: roleGroupsData, isLoading: isRoleGroupsLoading, isError: isRoleGroupsError } = useGetValidEnum(SKUPINA_ROL)

    const { mutateAsync: mutateAsyncApprove, isSuccess, isLoading: isLoadingUpdatePo } = useUpdateWithOnePoAndRoles()
    const { mutateAsync: processEventMutationAsync, isSuccess: isSuccessPE, isLoading: isLoadingPE } = useProcessEvent()
    const [errorMessage, setErrorMessage] = useState('')

    const isLoading = [isLoadingRequest, isAllRolesLoading, isRoleGroupsLoading, isLoadingUpdatePo, isLoadingPE].some((item) => item)
    const isError = [isErrorRequest, isAllRolesError, isRoleGroupsError].some((item) => item)

    const handleApprove = useCallback(
        async (selectedRoles: RoleItem[], request?: ClaimUi) => {
            const dataApprove: IdentityWithOnePoAndRolesWithoutAuthResource = {
                orgId: request?.po,
                roleIds: selectedRoles?.map((item) => item.uuid) || [],
                identity: {
                    uuid: request?.createdBy,
                    firstName: request?.identityFirstName,
                    lastName: request?.identityLastName,
                    login: request?.identityLogin,
                    email: request?.email,
                    phone: request?.telephone,
                    mobile: request?.mobile,
                    position: request?.position,
                },
            }

            await mutateAsyncApprove({
                data: {
                    ...dataApprove,
                },
            }).then(async () => {
                const approve: ClaimEvent = {
                    type: ClaimEventType.DECISION_EVENT,
                    claimDecisionData: { action: ClaimDecisionDataAction.ACCEPT, uuid: userId } as ClaimDecisionData,
                }
                await processEventMutationAsync({
                    data: {
                        ...approve,
                    },
                })
                    .then(() => {
                        navigate(`${AdminRouteNames.REQUEST_LIST_ALL}`)
                    })
                    .catch((error) => {
                        setErrorMessage(error.message)
                    })
            })
        },
        [mutateAsyncApprove, navigate, processEventMutationAsync, userId],
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
                    navigate(`${AdminRouteNames.REQUEST_LIST_ALL}`)
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                })
        },
        [navigate, processEventMutationAsync, userId],
    )

    return allRolesData ? (
        <View
            data={data}
            roleData={{ roleGroupsData, allRolesData }}
            errorMessage={errorMessage}
            isLoading={isLoading}
            isError={isError}
            handleApproveClick={handleApprove}
            handleRefuseModalClick={handleRefuseModal}
            isSuccess={isSuccess || isSuccessPE}
        />
    ) : (
        <></>
    )
}
