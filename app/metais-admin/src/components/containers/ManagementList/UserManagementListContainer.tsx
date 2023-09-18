import React, { useCallback } from 'react'
import { useFindPages, useFind1, useUpdateIdentityState, useExportIdentities } from '@isdd/metais-common/api/generated/iam-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common'
import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useRevokeUserBatch } from '@isdd/metais-common/hooks/useRevokeUser'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useGetOrganizationsForIdentitiesList } from '@isdd/metais-common/hooks/useGetOrganizationsForIdentitiesList'

import {
    UserManagementFilterData,
    defaultFilterValues,
    extractOrganizationsForList as extractOrganizationsUuidsFromList,
    mapDataToManagementList as mapResponsesToManagementListData,
} from './UserManagementListUtils'

import { UserManagementActionsOverRowEnum, UserManagementListPageViewProps } from '@/components/views/userManagement/userManagementListWrapper'

interface UserManagementContainerProps {
    View: React.FC<UserManagementListPageViewProps>
}

const UserManagementListContainer: React.FC<UserManagementContainerProps> = ({ View }) => {
    const {
        state: { accessToken, user },
    } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { filter, handleFilterChange } = useFilterParams<UserManagementFilterData>({
        sort: [
            {
                orderBy: 'lastName',
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })

    const { mutate: revokeUserBatchMutation, isLoading: IsLoadingRevokeUserBatch, isError: IsErrorRevokeUserBatch } = useRevokeUserBatch()
    const {
        refetch: refetchExportIdentities,
        isLoading: isLoadingExport,
        isFetching: isFetchingExport,
        isError: isErrorExport,
    } = useExportIdentities({ query: { enabled: false } })

    const {
        isLoading: isLoadingTotalCount,
        isError: isErrorTotalCount,
        data: dataLength,
    } = useFindPages({
        expression: filter.fullTextSearch ?? '',
        state: filter.state ?? '',
        orgId: filter.orgId ?? '',
        roleUuid: filter.roleUuid ?? '',
    })

    const {
        data: identitiesList,
        isLoading: isLoadingManagementList,
        isError: isErrorManagementList,
        refetch: refetchManagementList,
    } = useFind1(filter.pageNumber ?? BASE_PAGE_NUMBER, filter.pageSize ?? BASE_PAGE_SIZE, {
        expression: filter.fullTextSearch ?? '',
        state: filter.state ?? '',
        orgId: filter.orgId ?? '',
        roleUuid: filter.roleUuid ?? '',
        orderBy: filter.sort?.[0]?.orderBy ?? '',
        direction: filter.sort?.[0]?.sortDirection ?? '',
    })

    const identitiesUuids = identitiesList?.map((item) => item?.uuid || '').filter((item) => item) ?? []
    const {
        data: organizationsForListData,
        isLoading: isLoadingOrganizationsForList,
        isError: isErrorOrganizationsForList,
        isFetching: isFetchingOrganizationsForList,
    } = useGetOrganizationsForIdentitiesList({
        uuids: identitiesUuids,
    })

    const {
        data: ciListData,
        isLoading: isLoadingCiList,
        isError: isErrorCiList,
        isFetching: isFetchingCiList,
    } = useReadCiList1(
        {
            page: 1,
            perpage: 9999,
            filter: {
                metaAttributes: {
                    state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER'],
                },
                type: ['PO'],
                uuid: extractOrganizationsUuidsFromList(organizationsForListData),
            },
        },
        { query: { enabled: !!organizationsForListData } },
    )

    const updateIdentityStateMutation = useUpdateIdentityState({
        mutation: {
            onSuccess: () => {
                refetchManagementList()
            },
        },
    })
    const {
        isLoading: isLoadingUpdateIdentityStateMutation,
        isError: isErrorUpdateIdentityStateMutation,
        isSuccess: isSuccessUpdateIdentityStateMutation,
    } = updateIdentityStateMutation

    const updateIdentityStateBatchMutation = useMutation({
        mutationFn: (variables: { uuids: string[]; activate: boolean }) => {
            const { uuids, activate } = variables
            const promises = uuids
                .map((uuid) => ({
                    uuid,
                    activate,
                }))
                .map((params) => updateIdentityStateMutation.mutate({ data: { uuid: params.uuid, activate: params.activate } }))
            return Promise.all(promises)
        },
    })
    const {
        isSuccess: isSuccessUpdateIdentityStateMutationsBatch,
        isLoading: isLoadingUpdateIdentityStateMutationBatch,
        isError: isErrorUpdateIdentityStateMutationBatch,
    } = updateIdentityStateBatchMutation

    const handleBlockRowsAction = useCallback(
        (identities: { uuid: string; login: string }[], activate: boolean) => {
            if (identities && identities.length) {
                updateIdentityStateBatchMutation.mutate({ uuids: identities.map((identity) => identity.uuid), activate })
                if (!activate) {
                    revokeUserBatchMutation(identities.map((identity) => ({ token: accessToken, login: identity.login })))
                }
            }
        },
        [revokeUserBatchMutation, updateIdentityStateBatchMutation, accessToken],
    )

    const handleRowAction = useCallback(
        (identity: { uuid: string; login: string }, action: UserManagementActionsOverRowEnum, isCurrentlyBlocked?: boolean) => {
            if (action === UserManagementActionsOverRowEnum.EDIT) {
                navigate(`${AdminRouteNames.USER_MANAGEMENT}/edit/${identity.uuid}`, { state: { from: location } })
            }
            if (action === UserManagementActionsOverRowEnum.CHANGE_PASSWORD) {
                navigate(`${AdminRouteNames.USER_MANAGEMENT}/pass/${identity.uuid}`, { state: { from: location } })
            }
            if (action === UserManagementActionsOverRowEnum.BLOCK && isCurrentlyBlocked !== undefined) {
                if (identity.uuid) {
                    updateIdentityStateBatchMutation.mutate({ uuids: [identity.uuid], activate: isCurrentlyBlocked === true })
                    if (identity.login && accessToken && !isCurrentlyBlocked) {
                        revokeUserBatchMutation([{ token: accessToken, login: identity.login }])
                    }
                }
            }
        },
        [navigate, revokeUserBatchMutation, updateIdentityStateBatchMutation, accessToken, location],
    )

    const handleExport = useCallback(() => {
        refetchExportIdentities()
    }, [refetchExportIdentities])

    const isLoading = [
        isLoadingTotalCount,
        isLoadingManagementList,
        isLoadingOrganizationsForList && isFetchingOrganizationsForList,
        isLoadingCiList && isFetchingCiList,
        isLoadingUpdateIdentityStateMutation,
        isLoadingUpdateIdentityStateMutationBatch,
        IsLoadingRevokeUserBatch,
    ].some((item) => item)
    const isQueryError = [isErrorTotalCount, isErrorManagementList, isErrorOrganizationsForList, isErrorCiList, IsErrorRevokeUserBatch].some(
        (item) => item,
    )

    const isMutationSuccess = isSuccessUpdateIdentityStateMutation || isSuccessUpdateIdentityStateMutationsBatch
    const isMutationError = isErrorUpdateIdentityStateMutation || isErrorUpdateIdentityStateMutationBatch

    const data = {
        list: mapResponsesToManagementListData(identitiesList, organizationsForListData, ciListData, user?.uuid),
        dataLength: dataLength || 0,
    }

    return (
        <View
            data={data}
            filter={filter ?? defaultFilterValues}
            handleFilterChange={handleFilterChange}
            handleRowAction={handleRowAction}
            handleBlockRowsAction={handleBlockRowsAction}
            handleExport={handleExport}
            isLoading={isLoading}
            isError={isQueryError}
            isLoadingExport={isLoadingExport && isFetchingExport}
            isErrorExport={isErrorExport}
            isMutationError={isMutationError}
            isMutationSuccess={isMutationSuccess}
        />
    )
}

export default UserManagementListContainer
