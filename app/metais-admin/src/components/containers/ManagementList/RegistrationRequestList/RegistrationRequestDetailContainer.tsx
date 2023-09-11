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
    FindAll311Params,
    Identity,
    IdentityWithOnePoAndRolesWithoutAuthResource,
    useFindAll11,
    useFindAll311Hook,
    useUpdateIdentityState,
    useUpdateOrCreateWithGid,
} from '@isdd/metais-common/api/generated/iam-swagger'
import { EnumType, QueryFeedback, useGetValidEnum } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { RoleItem } from '@/components/views/userManagement/request-list-view/request-detail/RequestRolesForm'

export interface IRequestRoleData {
    roleGroupsData: EnumType | undefined
    allRolesData: FindAll11200 | undefined
}
export interface IUserDetailContainerView {
    data?: ClaimUi
    roleData: IRequestRoleData
    isSuccess: boolean
    isLoading: boolean
    errorMessage: string
    handleRefuseModalClick: (text: string) => void
    handleApproveClick: (selectedRoles: RoleItem[], request?: ClaimUi) => void
}
interface IRegistrationRequestDetailContainer {
    userId: string
    View: React.FC<IUserDetailContainerView>
}

export const RegistrationRequestDetailContainer: React.FC<IRegistrationRequestDetailContainer> = ({ userId, View }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const SKUPINA_ROL = 'SKUPINA_ROL'

    const findGidDataByLogin = useFindAll311Hook()
    const { mutateAsync: mutateAsyncUpdateIdentity, isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate } = useUpdateIdentityState()
    const { mutateAsync: mutateAsyncApprove, isSuccess, isLoading: isLoadingCreate } = useUpdateOrCreateWithGid()
    const { isLoading: isLoadingRequest, isError: isErrorRequest, data } = useRead(userId)
    const { data: roleGroupsData, isLoading: isRoleGroupsLoading, isError: isRoleGroupsError } = useGetValidEnum(SKUPINA_ROL)
    const { mutateAsync: processEventMutationAsync, isSuccess: isSuccessPE, isLoading: isLoadingPE } = useProcessEvent()
    const { data: allRolesData, isLoading: isAllRolesLoading, isError: isAllRolesError } = useFindAll11()
    const [errorMessage, setErrorMessage] = useState('')

    const isLoading = [isLoadingRequest, isAllRolesLoading, isRoleGroupsLoading, isLoadingCreate, isLoadingPE, isLoadingUpdate].some((item) => item)
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
            })
                .then(async () => {
                    await findGidDataByLogin({ login: request?.identityLogin } as FindAll311Params)
                        .then(async (resGid) => {
                            const uuid = (resGid as Identity).uuid ?? ''
                            const approve: ClaimEvent = {
                                type: ClaimEventType.DECISION_EVENT,
                                claimDecisionData: { action: ClaimDecisionDataAction.ACCEPT, uuid: userId } as ClaimDecisionData,
                            }

                            await mutateAsyncUpdateIdentity({ data: { uuid: uuid, activate: true } })
                                .then(async () => {
                                    await processEventMutationAsync({
                                        data: {
                                            ...approve,
                                        },
                                    })
                                        .then(() => {
                                            navigate(`${AdminRouteNames.REGISTRATION_REQUEST_LIST}`)
                                        })
                                        .catch((error) => {
                                            setErrorMessage(error.message)
                                        })
                                })
                                .catch((error) => {
                                    setErrorMessage(error.message)
                                })
                        })
                        .catch((error) => {
                            setErrorMessage(error.message)
                        })
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                })
        },
        [findGidDataByLogin, mutateAsyncApprove, mutateAsyncUpdateIdentity, navigate, processEventMutationAsync, userId],
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
                    navigate(`${AdminRouteNames.REGISTRATION_REQUEST_LIST}`)
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                })
        },
        [navigate, processEventMutationAsync, userId],
    )

    if (isLoading || isError) {
        return (
            <QueryFeedback
                loading={isLoading}
                error={isError}
                errorProps={{ errorMessage: t('managementList.containerQueryError') }}
                indicatorProps={{ fullscreen: true, layer: 'parent' }}
            />
        )
    }

    return (
        <View
            data={data}
            roleData={{ roleGroupsData, allRolesData }}
            handleRefuseModalClick={handleRefuseModal}
            handleApproveClick={handleApprove}
            isSuccess={isSuccess || isSuccessPE || isSuccessUpdate}
            isLoading={isLoading}
            errorMessage={errorMessage}
        />
    )
}
