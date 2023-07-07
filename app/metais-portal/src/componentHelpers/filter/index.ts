import { IFilter } from '@isdd/idsk-ui-kit/types'
import { CiListFilterContainerUi, ReadCiNeighboursWithAllRelsUsingGETParams } from '@isdd/metais-common/api'

export const mapFilterToNeighborsApi = <T>(filter: IFilter, defaultApiFilter?: { [filterName: string]: T } | T): CiListFilterContainerUi => {
    const { pageNumber, pageSize, sort } = filter
    return {
        ...defaultApiFilter,
        page: pageNumber,
        perpage: pageSize,
        sortBy: sort?.[0]?.orderBy ?? '',
        sortType: sort?.[0]?.sortDirection,
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
