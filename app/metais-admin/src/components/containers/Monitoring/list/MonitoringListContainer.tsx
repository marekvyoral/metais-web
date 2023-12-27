import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { FindActiveMonitoringCfgParams, useFindActiveMonitoringCfg } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { CiListFilterContainerUi, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SortType } from '@isdd/idsk-ui-kit/types'

import { IMonitoringListFilterData, IMonitoringListView } from '@/components/views/monitoring/list'

interface IMonitoringListContainer {
    View: React.FC<IMonitoringListView>
}

export const MonitoringListContainer: React.FC<IMonitoringListContainer> = ({ View }) => {
    const defaultFilterValues: IMonitoringListFilterData = {
        isvsUuid: '',
    }

    const { filter, handleFilterChange } = useFilterParams<IMonitoringListFilterData>({
        ...defaultFilterValues,
    })

    const monitoringCfgParamValues = useMemo((): FindActiveMonitoringCfgParams => {
        const monitoringParams: FindActiveMonitoringCfgParams = {
            ...(!!filter.isvsUuid && { isvsUuid: filter.isvsUuid }),
            page: filter.pageNumber ?? BASE_PAGE_NUMBER,
            pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
        }
        return monitoringParams
    }, [filter.isvsUuid, filter.pageNumber, filter.pageSize])

    const ciListParamValues = useMemo((): CiListFilterContainerUi => {
        const monitoringParams: CiListFilterContainerUi = {
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

    const { data: ciListData, isLoading: isLoadingCiList, isFetching: isFetchingCiList, isError: isErrorCiList } = useReadCiList1(ciListParamValues)

    const refetchListData = async () => {
        await getMonitoringListRefetch()
    }

    return (
        <QueryFeedback
            loading={isLoading || isLoadingCiList || isFetchingCiList}
            error={isError || isErrorCiList}
            indicatorProps={{ layer: 'parent' }}
        >
            <View
                monitoringCfgApiData={monitoringCfgData}
                ciListData={ciListData}
                filter={filter}
                defaultFilterValues={defaultFilterValues}
                isLoadingNextPage={isFetching}
                handleFilterChange={handleFilterChange}
                refetchListData={refetchListData}
            />
        </QueryFeedback>
    )
}
