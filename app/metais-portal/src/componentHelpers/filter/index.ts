import { IFilter } from '@isdd/idsk-ui-kit/types'
import {
    CiListFilterContainerUi,
    ReadCiNeighboursWithAllRelsParams,
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    ReadAllCiHistoryVersionsParams,
} from '@isdd/metais-common/api'

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

export const mapFilterToHistoryVersionsApi = (filter: IFilter): ReadAllCiHistoryVersionsParams => {
    const { pageNumber, pageSize } = filter

    return {
        page: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
    }
}

export const mapFilterToNeighboursWithAllRelsApi = (
    originalFilter: ReadCiNeighboursWithAllRelsParams,
    filterChanges: IFilter,
): ReadCiNeighboursWithAllRelsParams => {
    const { pageNumber, pageSize } = filterChanges

    return {
        ...originalFilter,
        page: pageNumber ?? originalFilter.page,
        perPage: pageSize ?? originalFilter.perPage,
    }
}
