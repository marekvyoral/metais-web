import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import {
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    HistoryVersionsListUiConfigurationItemUi,
    NeighbourSetUi,
    ReportResultObject,
} from '@isdd/metais-common/api'

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

export const mapGenericTypeToPagination = <T extends { totalCount?: number }>(uiFilter?: IFilter, data?: T): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: data?.totalCount ?? 0,
    }
}

export const mapReportResultToPagination = (uiFilter?: IFilter, data?: ReportResultObject | void): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: data?.totalCount ?? 0,
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
