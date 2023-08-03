import { IFilter } from '@isdd/idsk-ui-kit/types'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import {
    FilterAttributesUi,
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

export const mapFilterParamsToApi = <T extends IFilterParams>(filterParams: T): FilterAttributesUi[] => {
    const attributes: FilterAttributesUi[] = []
    const keysToSkip = new Set(['fullTextSearch', 'attributeFilters', 'sort', 'pageSize', 'pageNumber'])
    for (const [key, value] of Object.entries(filterParams)) {
        if (keysToSkip.has(key)) continue
        if (value) {
            if (Array.isArray(value)) {
                attributes.push({
                    name: key,
                    filterValue: value.map((val) => ({
                        value: val,
                        equality: 'EQUAL',
                    })),
                })
            } else if (value === 'false' || value === 'true') {
                attributes.push({
                    name: key,
                    filterValue: [
                        {
                            value: value,
                            equality: 'EQUAL',
                        },
                    ],
                })
            } else {
                attributes.push({
                    name: key,
                    filterValue: [
                        {
                            value,
                            equality: 'FULLTEXT',
                        },
                    ],
                })
            }
        }
    }

    for (const [key, attrs] of Object.entries(filterParams?.attributeFilters || {})) {
        if (!key) continue

        const combinedAttrs: FilterAttributesUi = {
            name: key,
            filterValue: attrs.filter((attr) => attr.value && attr.operator).map((attr) => ({ value: attr.value, equality: attr.operator })),
        }
        if (combinedAttrs.filterValue && combinedAttrs.filterValue.length > 0) {
            attributes.push(combinedAttrs)
        }
    }

    return attributes
}
