import { IFilter } from '@isdd/idsk-ui-kit/types'

import { NeighboursFilterContainerUi } from '@/api'

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
