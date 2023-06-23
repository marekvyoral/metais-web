import { IFilter } from '@isdd/idsk-ui-kit/types'

import { NeighboursFilterContainerUi, ReadCiNeighboursWithAllRelsUsingGETParams } from '@/api'

export const mapFilterToNeighborsApi = (originalFilter: NeighboursFilterContainerUi, filterChanges: IFilter): NeighboursFilterContainerUi => {
    const { pageNumber, pageSize } = filterChanges

    return {
        ...originalFilter,
        page: pageNumber === undefined ? originalFilter.page : pageNumber,
        perpage: pageSize === undefined ? originalFilter.perpage : pageSize,
    }
}

export const mapFilterToNeighboursWithAllRelsApi = (
    originalFilter: ReadCiNeighboursWithAllRelsUsingGETParams,
    filterChanges: IFilter,
): ReadCiNeighboursWithAllRelsUsingGETParams => {
    const { pageNumber, pageSize } = filterChanges

    return {
        ...originalFilter,
        page: pageNumber === undefined ? originalFilter.page : pageNumber,
        perPage: pageSize === undefined ? originalFilter.perPage : pageSize,
    }
}
