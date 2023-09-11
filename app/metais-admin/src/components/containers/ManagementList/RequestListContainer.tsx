import { IFilter } from '@isdd/idsk-ui-kit/types/filter'
import { EnumType } from '@isdd/metais-common/api'
import { FindAll11200 } from '@isdd/metais-common/api/generated/iam-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, EClaimState } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetRequestList } from '@isdd/metais-common/hooks/useGetRequestList'
import { QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
}

interface IRequestListContainerProps {
    listType: RequestListType
    View: React.FC<IRequestListView>
}

export const RequestListContainer: React.FC<IRequestListContainerProps> = ({ listType, View }) => {
    const { t } = useTranslation()

    const { filter, handleFilterChange } = useFilterParams<IRequestListFilterView>({
        status: EClaimState.ALL,
        sortAttribute: 'createdAt',
        ascending: false,
    })

    const { isLoading, isError, data } = useGetRequestList({
        uuids: [
            filter.pageNumber?.toString() || '',
            filter.pageSize?.toString() || '',
            filter.status,
            filter.ascending?.toString(),
            filter.sortAttribute,
            filter.fullTextSearch || '',
        ],
        filter: {
            page: filter.pageNumber ? +filter.pageNumber - 1 : BASE_PAGE_NUMBER - 1,
            perpage: filter.pageSize ? +filter.pageSize : BASE_PAGE_SIZE,
            sortAttribute: filter.sortAttribute,
            ascending: filter.ascending,
            filter: {
                searchFilter: filter.fullTextSearch,
                anonymous: listType === RequestListType.REGISTRATION,
                status: filter.status,
                ...(listType === RequestListType.GDPR ? { name: 'GDPR' } : ''),
            },
        },
    })

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
            listType={listType}
            route={AdminRouteNames.GDPR_REQUEST_LIST}
            data={data}
            defaultFilterParams={filter}
            handleFilterChange={handleFilterChange}
        />
    )
}
