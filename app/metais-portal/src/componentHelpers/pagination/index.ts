import { Pagination } from '@isdd/idsk-ui-kit/types'
import {
    NeighbourSetUi,
    NeighboursFilterContainerUi,
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    CiListFilterContainerUi,
    ConfigurationItemSetUi,
} from '@isdd/metais-common/api'

export const mapNeighboursSetSourceToPagination = (requestApi: NeighboursFilterContainerUi, data?: NeighbourSetUi | void): Pagination => {
    return {
        pageNumber: requestApi.page ?? BASE_PAGE_NUMBER,
        pageSize: requestApi.perpage ?? BASE_PAGE_SIZE,
        dataLength: data?.fromNodes?.pagination?.totaltems ?? 0,
    }
}

export const mapNeighboursSetTargetToPagination = (requestApi: NeighboursFilterContainerUi, data: NeighbourSetUi | void): Pagination => {
    return {
        pageNumber: requestApi.page ?? BASE_PAGE_NUMBER,
        pageSize: requestApi.perpage ?? BASE_PAGE_SIZE,
        dataLength: data?.toNodes?.pagination?.totaltems ?? 0,
    }
}
export const mapConfigurationItemSetToPagination = (requestApi: CiListFilterContainerUi, data: ConfigurationItemSetUi | void): Pagination => {
    return {
        pageNumber: requestApi.page ?? BASE_PAGE_NUMBER,
        pageSize: requestApi.perpage ?? BASE_PAGE_SIZE,
        dataLength: data?.pagination?.totaltems ?? 0,
    }
}
