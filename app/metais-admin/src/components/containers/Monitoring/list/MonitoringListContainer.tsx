import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { FindActiveMonitoringCfgParams, useFindActiveMonitoringCfg } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { CiListFilterContainerUi, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SortType } from '@isdd/idsk-ui-kit/types'

import { IMonitoringListFilterData, IMonitoringListView } from '@/components/views/monitoring/list'

interface IMonitoringListContainer {
    View: React.FC<IMonitoringListView>
}

export const MonitoringListContainer: React.FC<IMonitoringListContainer> = ({ View }) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = user !== null

    const defaultFilterValues: IMonitoringListFilterData = {
        isvsUuid: '',
    }

    const { filter, handleFilterChange } = useFilterParams<IMonitoringListFilterData>({
        // sort: [
        //     {
        //         orderBy: VotesListColumnsEnum.EFFECTIVE_FROM,
        //         sortDirection: SortType.DESC,
        //     },
        // ],
        ...defaultFilterValues,
    })

    const monitoringCfgParamValues = useMemo((): FindActiveMonitoringCfgParams => {
        const monitoringParams: FindActiveMonitoringCfgParams = {
            page: filter.pageNumber ?? BASE_PAGE_NUMBER,
            pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
        }
        return monitoringParams
    }, [filter.pageNumber, filter.pageSize])

    const ciListParamValues = useMemo((): CiListFilterContainerUi => {
        const monitoringParams: CiListFilterContainerUi = {
            // page: filter.pageNumber ?? BASE_PAGE_NUMBER,
            // perpage: filter.pageSize ?? BASE_PAGE_SIZE,
            sortBy: ATTRIBUTE_NAME.Gen_Profil_nazov,
            sortType: SortType.ASC,
            filter: {
                metaAttributes: {
                    state: ['DRAFT'],
                },
                type: ['ISVS', 'KS', 'AS'],
            },
        }
        return monitoringParams
    }, [])

    const {
        data: monitoringCfgData,
        isLoading,
        isFetching,
        isError,
        refetch: getMonitoringListRefetch,
    } = useFindActiveMonitoringCfg(monitoringCfgParamValues)

    const {
        data: ciListData,
        isLoading: isLoadingCiList,
        // isFetching: isFetchingCiList,
        isError: isErrorCiList,
        // refetch: getReadCiListRefetch,
    } = useReadCiList1(ciListParamValues)

    return (
        <QueryFeedback loading={isLoading || isLoadingCiList} error={isError || isErrorCiList} indicatorProps={{ layer: 'parent' }}>
            <View
                isUserLogged={isUserLogged}
                monitoringCfgApiData={monitoringCfgData}
                ciListData={ciListData}
                filter={filter}
                defaultFilterValues={defaultFilterValues}
                isLoadingNextPage={isFetching}
                handleFilterChange={handleFilterChange}
                getMonitoringListRefetch={getMonitoringListRefetch}
            />
        </QueryFeedback>
    )
}
