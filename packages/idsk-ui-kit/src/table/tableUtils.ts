import { Dispatch, SetStateAction } from 'react'
import { ColumnDef, ColumnOrderState, Row, SortingState } from '@tanstack/react-table'

import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'

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

type HasMetaAttributesWithStatePropertyType = {
    original: {
        metaAttributes: {
            state: string
        }
    }
}

export const hasMetaAttributesWithStateProperty = (obj: unknown): obj is HasMetaAttributesWithStatePropertyType => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'original' in obj &&
        typeof obj.original === 'object' &&
        obj.original !== null &&
        'metaAttributes' in obj.original &&
        typeof obj.original.metaAttributes === 'object' &&
        obj.original.metaAttributes !== null &&
        'state' in obj.original.metaAttributes &&
        typeof obj.original.metaAttributes.state === 'string'
    )
}

export const getExpandableRowContentId = <T>(row: Row<T>) => {
    return `${row.id}_content`
}
