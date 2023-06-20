import { NeighboursFilterContainerUi } from '@/api'
import { IFilter } from '@/types/filter'

export const mapFilterToNeighborsApi = (originalFilter: NeighboursFilterContainerUi, filterChanges: IFilter): NeighboursFilterContainerUi => {
    const { pageNumber, pageSize, sortBy, sortSource, sortType } = filterChanges

    return {
        ...originalFilter,
        page: pageNumber === undefined ? originalFilter.page : pageNumber,
        perpage: pageSize === undefined ? originalFilter.perpage : pageSize,
        sortBy: sortBy === undefined ? originalFilter.sortBy : sortBy,
        sortSource: sortSource === undefined ? originalFilter.sortSource : sortSource,
        sortType: sortType === undefined ? originalFilter.sortType : sortType,
    }
}
