import { IFilter, SortType } from '@isdd/idsk-ui-kit/src/types'
import { FieldValues } from 'react-hook-form'

import { GetFOPReferenceRegisters1Params } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { CiListFilterContainerUi, NeighboursFilterContainerUi, NeighboursFilterUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { DEFAULT_PAGESIZE_OPTIONS, FIRST_PAGE_NUMBER } from '@isdd/metais-common/constants'

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

export const mapFilterToNeighborsApiWithTextSearch = <T>(
    filter: IFilter,
    defaultApiFilter?: { [filterName: string]: T } | T,
): CiListFilterContainerUi => {
    const { pageNumber, pageSize, sort } = filter
    return {
        filter: { ...defaultApiFilter, fullTextSearch: filter.full },
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

export const mapFilterToRefRegisters = (filterParams: FieldValues & IFilterParams & IFilter): GetFOPReferenceRegisters1Params => {
    const { pageNumber, pageSize, sort } = filterParams

    const mappedFilter: GetFOPReferenceRegisters1Params = {
        pageNumber: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
        ascending: sort?.[0]?.sortDirection === SortType.ASC,
        ...(sort?.[0]?.orderBy && { sortBy: sort?.[0]?.orderBy }),
    }

    if (filterParams?.registratorUuid) {
        mappedFilter.registratorUuid = filterParams?.registratorUuid
    }
    if (filterParams?.managerUuid) {
        mappedFilter.managerUuid = filterParams?.managerUuid
    }
    if (filterParams?.isvsUuid) {
        mappedFilter.isvsUuid = filterParams?.isvsUuid
    }
    if (filterParams?.state) {
        mappedFilter.state = filterParams?.state
    }
    if (filterParams?.muk) {
        mappedFilter.muk = filterParams?.muk
    }

    return mappedFilter
}
