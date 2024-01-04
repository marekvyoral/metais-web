import { SortType } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FindActiveMonitoringCfgParams, useFindActiveMonitoringCfg } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useMemo, useState } from 'react'

import { IMonitoringListFilterData, IMonitoringListView } from '@/components/views/monitoring/list'

interface IMonitoringListContainer {
    View: React.FC<IMonitoringListView>
}

export const MonitoringListContainer: React.FC<IMonitoringListContainer> = ({ View }) => {
    const defaultFilterValues: IMonitoringListFilterData = {
        isvsUuid: '',
    }
    const { filter, handleFilterChange } = useFilterParams<IMonitoringListFilterData>(defaultFilterValues)
    const [defaultValue, setDefaultValue] = useState<ConfigurationItemUi | undefined>(undefined)
    const monitoringCfgParamValues = useMemo((): FindActiveMonitoringCfgParams => {
        const monitoringParams: FindActiveMonitoringCfgParams = {
            ...(!!filter.isvsUuid && { isvsUuid: filter.isvsUuid }),
            page: filter.pageNumber ?? BASE_PAGE_NUMBER,
            pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
        }
        return monitoringParams
    }, [filter.isvsUuid, filter.pageNumber, filter.pageSize])

    const {
        data: monitoringCfgData,
        isLoading,
        isFetching,
        isError,
        refetch: getMonitoringListRefetch,
    } = useFindActiveMonitoringCfg(monitoringCfgParamValues)

    const readCiList = useReadCiList1Hook()
    const [isErrorCiList, setIsErrorCiList] = useState<boolean>(false)
    const refetchListData = async () => {
        await getMonitoringListRefetch()
    }

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        try {
            setIsErrorCiList(false)
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const options = await readCiList({
                sortBy: ATTRIBUTE_NAME.Gen_Profil_nazov,
                sortType: SortType.ASC,
                filter: {
                    metaAttributes: {
                        state: ['DRAFT'],
                    },
                    type: ['ISVS', 'KS', 'AS'],
                    ...(!!searchQuery && { searchFields: ['Gen_Profil_nazov', 'Gen_Profil_kod_metais'] }),
                    fullTextSearch: searchQuery,
                },
                page: page,
                perpage: 50,
            })
            return {
                options: options.configurationItemSet || [],
                hasMore: options.configurationItemSet?.length == 50 ? true : false,
                additional: {
                    page: page,
                },
            }
        } catch {
            setIsErrorCiList(true)
            return {
                options: [],
                hasMore: false,
                additional: {
                    page: 1,
                },
            }
        }
    }

    useEffect(() => {
        const getData = (uuid: string) => {
            readCiList({
                sortBy: ATTRIBUTE_NAME.Gen_Profil_nazov,
                sortType: SortType.ASC,
                filter: {
                    metaAttributes: {
                        state: ['DRAFT'],
                    },
                    type: ['ISVS', 'KS', 'AS'],
                    uuid: [uuid],
                },
                page: 1,
                perpage: 1,
            }).then((data) => {
                setDefaultValue(data.configurationItemSet?.[0])
            })
        }

        if (!defaultValue && filter.isvsUuid) {
            getData(filter.isvsUuid)
        }

        if (!filter.isvsUuid) {
            setDefaultValue(undefined)
        }
    }, [defaultValue, filter.isvsUuid, readCiList])

    return (
        <QueryFeedback loading={isLoading} error={isError || isErrorCiList} indicatorProps={{ layer: 'parent' }}>
            <View
                monitoringCfgApiData={monitoringCfgData}
                filter={filter}
                defaultFilterValues={defaultFilterValues}
                isLoadingNextPage={isFetching}
                handleFilterChange={handleFilterChange}
                refetchListData={refetchListData}
                loadOptions={loadOptions}
                ciDefaultValue={defaultValue}
            />
        </QueryFeedback>
    )
}