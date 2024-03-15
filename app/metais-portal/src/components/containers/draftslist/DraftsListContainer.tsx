import { IOption } from '@isdd/idsk-ui-kit/index'
import { SortType } from '@isdd/idsk-ui-kit/src/types'
import { ATTRIBUTE_NAME } from '@isdd/metais-common'
import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useWorkingGroups } from '@isdd/metais-common/hooks/useWorkingGroups'
import { DraftFilterResponse, mapFilterToStandardDrafts } from '@isdd/metais-common/src/api/filter/filterApi'
import { useGetFOPStandardRequests } from '@isdd/metais-common/src/api/generated/standards-swagger'
import { useFilterForCiList, usePagination } from '@isdd/metais-common/src/api/hooks/containers/containerHelpers'
import React, { useMemo } from 'react'
import { FieldValues } from 'react-hook-form'

import { IDraftsListTable } from '@/types/views'

interface IDraftsListDataTableContainerProps<T> {
    View: React.FC<IDraftsListTable>
    defaultFilterValues: T
}

export const DraftsListContainer = <T extends FieldValues & IFilterParams>({ View, defaultFilterValues }: IDraftsListDataTableContainerProps<T>) => {
    const { filterParams, handleFilterChange } = useFilterForCiList<T, DraftFilterResponse>({
        ...defaultFilterValues,
        sort: [{ orderBy: ATTRIBUTE_NAME.createdAt, sortDirection: SortType.DESC }],
    })

    const { data: workingGroupOptionsData, isLoading: isWorkingGroupOptionsLoading } = useFind2111({})

    const workingGroupOptions: IOption<string>[] = useMemo(() => {
        if (Array.isArray(workingGroupOptionsData)) {
            return workingGroupOptionsData?.map((dataGroup) => ({
                label: dataGroup?.shortName ?? '',
                value: dataGroup?.uuid ?? '',
            }))
        }
        return [
            {
                label: workingGroupOptionsData?.shortName ?? '',
                value: workingGroupOptionsData?.uuid ?? '',
            },
        ]
    }, [workingGroupOptionsData])

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
    const isLoading = isDraftsLoading || workGroupIsLoading || isWorkingGroupOptionsLoading
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
            workingGroupOptions={workingGroupOptions}
        />
    )
}
