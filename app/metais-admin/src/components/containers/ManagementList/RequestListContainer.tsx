import { IFilter } from '@isdd/idsk-ui-kit/types/filter'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { FindAll11200 } from '@isdd/metais-common/api/generated/iam-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, EClaimState } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect } from 'react'
import { useReadList } from '@isdd/metais-common/api/generated/claim-manager-swagger'

import { IRequestListView } from '@/components/views/userManagement/request-list-view/RequestListView'

export enum RequestListType {
    GDPR = 'GDPR',
    REGISTRATION = 'REGISTRATION',
    REQUESTS = 'REQUESTS',
}

export interface UserManagementData {
    roleGroupsData: EnumType | undefined
    allRolesData: FindAll11200 | undefined
}
export interface IRequestListFilterView extends IFilterParams, IFilter {
    status: string
    sortAttribute: string
    ascending: boolean
    listType: RequestListType
}

interface IRequestListContainerProps {
    View: React.FC<IRequestListView>
}

const defaultFilterParams = {
    status: EClaimState.ALL,
    sortAttribute: 'createdAt',
    ascending: false,
    listType: RequestListType.REQUESTS,
}

export const RequestListContainer: React.FC<IRequestListContainerProps> = ({ View }) => {
    const { filter, handleFilterChange } = useFilterParams<IRequestListFilterView>(defaultFilterParams)

    const { isLoading, isError, data, mutateAsync } = useReadList()

    useEffect(() => {
        mutateAsync({
            data: {
                page: filter.pageNumber ? +filter.pageNumber - 1 : BASE_PAGE_NUMBER - 1,
                perpage: filter.pageSize ? +filter.pageSize : BASE_PAGE_SIZE,
                sortAttribute: filter.sortAttribute,
                ascending: filter.ascending,
                listType: filter.listType,
                filter: {
                    searchFilter: filter.fullTextSearch,
                    anonymous: filter.listType === RequestListType.REGISTRATION,
                    status: filter.status,
                    ...(filter.listType === RequestListType.GDPR ? { name: 'GDPR' } : ''),
                },
            },
        })
    }, [filter, mutateAsync])

    return (
        <View
            listType={filter.listType}
            route={AdminRouteNames.REQUEST_LIST_ALL}
            data={data}
            defaultFilterParams={filter}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
