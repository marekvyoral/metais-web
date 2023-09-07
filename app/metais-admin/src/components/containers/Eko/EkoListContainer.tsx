import { ColumnSort, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { QueryFeedback } from '@isdd/metais-common'
import { EkoCodeList, useDeleteHrEkoCode, useGetEkoCodes, useUpdateHrEkoCode } from '@isdd/metais-common/api'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'

export interface IFilterData extends IFilterParams, IFilter {
    isActive?: boolean
    orderBy?: string
    ascending?: string
}
export interface IView {
    defaultFilterParams: IFilterData
    data?: void | EkoCodeList | undefined
    handleFilterChange: (filter: IFilter) => void
    invalidateCodes: (ekoCodes: EkoCodeList) => Promise<void>
    deleteCodes: (ekoCodes: EkoCodeList) => Promise<void>
}

export interface IEkoListContainerProps {
    View: React.FC<IView>
}

export const EkoListContainer: React.FC<IEkoListContainerProps> = ({ View }) => {
    const defaultSort: ColumnSort = {
        orderBy: 'ekoCode',
        sortDirection: SortType.ASC,
    }

    const { filter, handleFilterChange } = useFilterParams<IFilterData>({
        orderBy: defaultSort.orderBy,
        ascending: defaultSort.sortDirection === SortType.ASC ? 'true' : 'false',
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    })
    const { mutateAsync } = useDeleteHrEkoCode()
    const { mutateAsync: updateMutateAsync } = useUpdateHrEkoCode()

    const { data, isLoading, isError } = useGetEkoCodes({
        sortBy: filter?.sortAttribute,
        ascending: filter?.ascending === 'true',
    })

    const invalidateCodes = async (ekoCodes: EkoCodeList) => {
        await updateMutateAsync({
            data: {
                ...ekoCodes,
            },
        })
    }

    const deleteCodes = async (ekoCodes: EkoCodeList) => {
        await mutateAsync({
            data: {
                ...ekoCodes,
            },
        })
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View
                data={data}
                deleteCodes={deleteCodes}
                invalidateCodes={invalidateCodes}
                defaultFilterParams={filter}
                handleFilterChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}
