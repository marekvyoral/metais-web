import { IFilter } from '@isdd/idsk-ui-kit/src/types'

import { CiListFilterContainerUi, NeighboursFilterContainerUi, NeighboursFilterUi } from '@isdd/metais-common/api'

export interface INeighboursFilter extends IFilter {
    neighboursFilter?: NeighboursFilterUi
}

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

export const mapFilterToRelationApi = (filter: INeighboursFilter, defaultApiFilter?: NeighboursFilterContainerUi): NeighboursFilterContainerUi => {
    const { pageNumber, pageSize, sort } = filter
    const currentNeighboursFilter = filter.neighboursFilter
    const neighboursFilter: NeighboursFilterUi = {
        ciType:
            currentNeighboursFilter?.ciType && currentNeighboursFilter.ciType.length > 0
                ? currentNeighboursFilter.ciType
                : defaultApiFilter?.neighboursFilter?.ciType,
        relType:
            currentNeighboursFilter?.relType && currentNeighboursFilter.relType.length > 0
                ? currentNeighboursFilter.relType
                : defaultApiFilter?.neighboursFilter?.relType,
        metaAttributes: {
            state:
                currentNeighboursFilter?.metaAttributes?.state && currentNeighboursFilter.metaAttributes.state.length > 0
                    ? currentNeighboursFilter.metaAttributes.state
                    : defaultApiFilter?.neighboursFilter?.metaAttributes?.state,
        },
        fullTextSearch: filter.neighboursFilter?.fullTextSearch,
    }
    return {
        neighboursFilter,
        page: pageNumber,
        perpage: pageSize,
        sortBy: sort?.[0]?.orderBy ?? '',
        sortType: sort?.[0]?.sortDirection,
    }
}
