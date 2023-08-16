import React from 'react'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FieldValues } from 'react-hook-form'
import { ConfigurationItemUiAttributes, useInvalidateConfigurationItem, useReadCiList1 } from '@isdd/metais-common/api'
import { IListView } from '@isdd/metais-common/types/list'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers/filter'
import { useGetColumnData, useFilterForCiList, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { QueryFeedback } from '@isdd/metais-common/index'
export interface IActions {
    setInvalid?: (entityId: string | undefined, configurationItem: ConfigurationItemUiAttributes | undefined) => Promise<void>
}

interface IOraganizationsListContainer<T> {
    entityName: string
    ListComponent: React.FC<IListView & IActions>
    defaultFilterValues: T
}

export const OraganizationsListContainer = <T extends FieldValues & IFilterParams>({
    entityName,
    ListComponent,
    defaultFilterValues,
}: IOraganizationsListContainer<T>) => {
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

    const { mutateAsync: setInvalid } = useInvalidateConfigurationItem()

    const InvalidateConfigurationItem = async (uuid: string | undefined, configurationItem: ConfigurationItemUiAttributes | undefined) => {
        if (!configurationItem) return
        await setInvalid({
            data: {
                attributes: Object.keys(configurationItem).map((key) => ({ value: configurationItem?.[key], name: key })),
                invalidateReason: { comment: '' },
                type: 'PO',
                uuid: uuid,
            },
        })
    }

    const isLoading = [isReadCiListLoading, isColumnsLoading].some((item) => item)
    const isError = [isReadCiListError, isColumnsError].some((item) => item)

    return (
        <QueryFeedback error={isError} loading={isLoading}>
            <ListComponent
                data={{ columnListData, tableData }}
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                resetUserSelectedColumns={resetColumns}
                storeUserSelectedColumns={saveColumnSelection}
                sort={filterParams?.sort ?? []}
                isLoading={isLoading}
                isError={isError}
                setInvalid={InvalidateConfigurationItem}
            />
        </QueryFeedback>
    )
}
