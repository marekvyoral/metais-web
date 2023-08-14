import React from 'react'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FieldValues } from 'react-hook-form'
import { useReadCiList1 } from '@isdd/metais-common/api'
import { IListView } from '@isdd/metais-common/types/list'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers/filter'
import { useGetColumnData, useFilterForCiList, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { QueryFeedback } from '@isdd/metais-common/index'
interface ICiListContainer<T> {
    entityName: string
    ListComponent: React.FC<IListView>
    defaultFilterValues: T
}

export const CiListContainer = <T extends FieldValues & IFilterParams>({ entityName, ListComponent, defaultFilterValues }: ICiListContainer<T>) => {
    const { columnListData, saveColumnSelection, resetColumns, isLoading: isColumnsLoading, isError: isColumnsError } = useGetColumnData(entityName)

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList(defaultFilterValues, entityName)

    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isError: isReadCiListError,
    } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams),
        },
    })

    const pagination = usePagination(tableData, filterParams)

    const isLoading = [isReadCiListLoading, isColumnsLoading].some((item) => item)
    const isError = [isReadCiListError, isColumnsError].some((item) => item)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <ListComponent
                data={{ columnListData, tableData }}
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                resetUserSelectedColumns={resetColumns}
                storeUserSelectedColumns={saveColumnSelection}
                sort={filterParams?.sort ?? []}
                isLoading={isLoading}
                isError={isError}
            />
        </QueryFeedback>
    )
}
