import React, { useMemo } from 'react'
import { GetFOPStandardRequestsParams, useGetFOPStandardRequests } from '@isdd/metais-common/src/api/generated/standards-swagger'
import { useFilterForCiList, usePagination } from '@isdd/metais-common/src/api/hooks/containers/containerHelpers'
import { ATTRIBUTE_NAME } from '@isdd/metais-common'
import { mapFilterToStandardDrafts } from '@isdd/metais-common/src/api/filter/filterApi'
import { SortType } from '@isdd/idsk-ui-kit/src/types'
import { useWorkingGroups } from '@isdd/metais-common/hooks/useWorkingGroups'
import { FieldValues } from 'react-hook-form'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

import { IDraftsListTable } from '@/types/views'

interface IDraftsListDataTableContainerProps<T> {
    View: React.FC<IDraftsListTable>
    defaultFilterValues: T
}

export const DraftsListContainer = <T extends FieldValues & IFilterParams>({ View, defaultFilterValues }: IDraftsListDataTableContainerProps<T>) => {
    const { filterParams, handleFilterChange } = useFilterForCiList<T, GetFOPStandardRequestsParams>({
        ...defaultFilterValues,
        sort: [{ orderBy: ATTRIBUTE_NAME.Sr_Name, sortDirection: SortType.DESC }],
    })

    const { data, isLoading: isDraftsLoading, isError: isDraftsError } = useGetFOPStandardRequests(mapFilterToStandardDrafts(filterParams))

    const workingGroupIdsPerPage = useMemo(() => {
        const ids = new Set<string>()
        data?.standardRequests?.map((standardRequest) => {
            if (standardRequest?.workGroupId) ids?.add(standardRequest?.workGroupId)
        })
        return Array.from(ids)
    }, [data])
    const {
        data: workGroup,
        isLoading: workGroupIsLoading,
        isError: workGroupIsError,
    } = useWorkingGroups({ workingGroupIds: workingGroupIdsPerPage })

    const pagination = usePagination({ pagination: { totaltems: data?.standardRequestsCount ?? 0 } }, filterParams)
    const isLoading = isDraftsLoading || workGroupIsLoading
    const isError = isDraftsError || workGroupIsError

    return (
        <View
            data={{
                draftsList: data?.standardRequests ?? [],
                workingGroups: workGroup,
            }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            sort={filterParams?.sort ?? []}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
