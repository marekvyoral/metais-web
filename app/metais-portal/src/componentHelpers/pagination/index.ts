import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { NeighbourSetUi, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, ConfigurationItemSetUi } from '@isdd/metais-common/api'

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
export const mapConfigurationItemSetToPagination = (uiFilter?: IFilter, data?: ConfigurationItemSetUi | void): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: data?.pagination?.totaltems ?? 0,
    }
}
