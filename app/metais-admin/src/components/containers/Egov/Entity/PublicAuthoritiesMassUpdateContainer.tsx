import { ConfigurationItemUiAttributes, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useReadChanges } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { BASE_PAGE_NUMBER } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { IListComponent } from '@isdd/metais-common/types/list'
import React, { useMemo } from 'react'
import { FieldValues } from 'react-hook-form'

export interface IActions {
    setInvalid?: (entityId: string | undefined, configurationItem: ConfigurationItemUiAttributes | undefined) => Promise<void>
}

interface IPublicAuthoritiesMassUpdateContainer<T> {
    entityName: string
    ListComponent: React.FC<IListComponent>
    defaultFilterValues: T
    entityId?: string
}

export const PublicAuthoritiesMassUpdateContainer = <T extends FieldValues & IFilterParams>({
    entityName,
    ListComponent,
    defaultFilterValues,
}: IPublicAuthoritiesMassUpdateContainer<T>) => {
    const { columnListData, isLoading: isColumnsLoading, isError: isColumnsError } = useGetColumnData(entityName)
    const { filter, handleFilterChange } = useFilterParams<T>(defaultFilterValues)

    const defaultRequestApi = {
        page: 1,
        perPage: BASE_PAGE_NUMBER,
        state: 'NEW',
    }

    const {
        data: tableData,
        isLoading: isReadLoading,
        isError: isReadChangesError,
        isFetched,
        refetch,
    } = useReadChanges({
        ...defaultRequestApi,
        state: filter.state || defaultFilterValues.state,
        page: filter.pageNumber || defaultFilterValues.pageNumber,
        perPage: filter.pageSize || defaultFilterValues.pageSize,
        ...(filter.cmdbId?.length > 0 ? { cmdbId: filter.cmdbId } : {}),
    })

    const readFilter = useMemo(() => {
        const uuidList = tableData?.configurationItemSet?.map((item) => item.uuid ?? '') ?? []
        return {
            filter: {
                type: ['PO'],
                metaAttributes: { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER'] },
                attributes: [],
                uuid: uuidList,
            },
        }
    }, [tableData?.configurationItemSet])

    const { data: ciData, isLoading: isReadCiListLoading, isError: isReadCiListError } = useReadCiList1(readFilter, { query: { enabled: isFetched } })

    const pagination = usePagination(tableData, filter)

    const isLoading = [isReadLoading, isReadCiListLoading, isColumnsLoading].some((item) => item)
    const isError = [isReadChangesError, isReadCiListError, isColumnsError].some((item) => item)
    return (
        <ListComponent
            data={{ columnListData, tableData, ciData }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            sort={filter?.sort ?? []}
            refetch={refetch}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
