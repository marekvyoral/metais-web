import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'

import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'

export const mapConfigurationItemSetToPagination = (uiFilter?: IFilter, dataLength?: number): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: dataLength ?? 0,
    }
}
