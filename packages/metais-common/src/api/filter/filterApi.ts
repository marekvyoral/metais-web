import { IFilter, SortType } from '@isdd/idsk-ui-kit/src/types'
import { FieldValues } from 'react-hook-form'

import { GetFOPStandardRequestsParams } from '../generated/standards-swagger'

import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, FIRST_PAGE_NUMBER } from '@isdd/metais-common/constants'
import { CiListFilterContainerUi, NeighboursFilterContainerUi, NeighboursFilterUi } from '@isdd/metais-common/api'
import { IFilterParams } from 'hooks/useFilter'

export interface INeighboursFilter extends IFilter {
    neighboursFilter?: NeighboursFilterUi
}

export const mapFilterToNeighborsApi = <T>(filter: IFilter, defaultApiFilter?: { [filterName: string]: T } | T): CiListFilterContainerUi => {
    const { pageNumber, pageSize, sort } = filter
    return {
        ...defaultApiFilter,
        page: pageNumber ? pageNumber : FIRST_PAGE_NUMBER,
        perpage: pageSize ? pageSize : Number(DEFAULT_PAGESIZE_OPTIONS[0].value),
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

export const mapFilterToStandardDrafts = (filterParams: FieldValues & IFilterParams & IFilter): GetFOPStandardRequestsParams => {
    const { pageNumber, pageSize, sort } = filterParams

    const mappedFilter: GetFOPStandardRequestsParams = {
        pageNumber: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
        ascending: sort?.[0]?.sortDirection === SortType.ASC,
        ...(sort?.[0]?.orderBy && { sortBy: sort?.[0]?.orderBy }),
    }

    if (filterParams?.createdBy) {
        mappedFilter.createdBy = filterParams?.createdBy
    }
    if (filterParams?.draftName) {
        mappedFilter.draftName = filterParams?.draftName
    }
    if (filterParams?.state) {
        mappedFilter.state = filterParams?.state
    }
    if (filterParams?.requestChannel) {
        mappedFilter.requestChannel = filterParams?.requestChannel
    }
    if (filterParams?.fromDate) {
        mappedFilter.fromDate = filterParams?.fromDate
    }
    if (filterParams?.toDate) {
        mappedFilter.toDate = filterParams?.toDate
    }

    return mappedFilter
}
