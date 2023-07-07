import { Dispatch, SetStateAction } from 'react'
import { ColumnDef, ColumnOrderState, SortingState } from '@tanstack/react-table'

import { ColumnSort, SortType } from '../types'

export const resetColumnOrder = <T>(columns: Array<ColumnDef<T>>, setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>>) => {
    setColumnOrder(columns.map((column) => column.id || ''))
}

export const transformSortingStateToColumnSort = (sortUpdater: (oldSort: SortingState) => SortingState, oldSort: SortingState): ColumnSort[] => {
    const newSort = sortUpdater?.(oldSort ?? [])
    return (
        newSort?.map((sortingStateColumnSort) => {
            return {
                orderBy: sortingStateColumnSort?.id,
                sortDirection: sortingStateColumnSort?.desc ? SortType.DESC : SortType.ASC,
            }
        }) ?? []
    )
}

export const transformColumnSortToSortingState = (sort?: ColumnSort[]) => {
    return sort?.map((columnSort) => ({ id: columnSort?.orderBy, desc: columnSort?.sortDirection === SortType.DESC })) ?? []
}
