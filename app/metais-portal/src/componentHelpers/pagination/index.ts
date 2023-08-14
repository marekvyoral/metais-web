import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { NeighbourSetUi, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, HistoryVersionsListUiConfigurationItemUi } from '@isdd/metais-common/api'

export const mapNeighboursSetSourceToPagination = (uiFilter?: IFilter, data?: NeighbourSetUi | void): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: data?.fromNodes?.pagination?.totaltems ?? 0,
    }
}

export const mapNeighboursSetTargetToPagination = (uiFilter?: IFilter, data?: NeighbourSetUi | void): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: data?.toNodes?.pagination?.totaltems ?? 0,
    }
}

export const mapConfigurationItemSetToPagination = (uiFilter?: IFilter, dataLength?: number): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: dataLength ?? 0,
    }
}

export const mapConfigurationItemHistoryListToPagination = (
    uiFilter?: IFilter,
    data?: HistoryVersionsListUiConfigurationItemUi | void,
): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: data?.pagination?.totaltems ?? 0,
    }
}
