import { mapReportsCiItemToOptions } from '@isdd/metais-common/componentHelpers'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { CiListFilterContainerUi, ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

export const loadEnumsCiOptions = async (
    searchQuery: string,
    additional: { page: number } | undefined,
    type: string,
    readCiList1: (ciListFilterContainerUi: CiListFilterContainerUi) => Promise<ConfigurationItemSetUi>,
    showInvalidated: boolean,
) => {
    const page = !additional?.page ? 1 : (additional?.page || 0) + 1

    const metaAttributes = showInvalidated ? { state: ['DRAFT', 'APPROVED_BY_OWNER', 'INVALIDATED'] } : { state: ['DRAFT', 'APPROVED_BY_OWNER'] }
    const queryOptions = {
        filter: {
            type: [type ?? ''],
            metaAttributes,
            fullTextSearch: searchQuery,
        },
        page: page,
        perpage: BASE_PAGE_SIZE,
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
    }

    const data = await readCiList1(queryOptions)
    const hasMore = page + 1 <= (data.pagination?.totalPages ?? 0)

    const options = mapReportsCiItemToOptions(data.configurationItemSet)
    return {
        options: options || [],
        hasMore: hasMore,
        additional: {
            page: page,
        },
    }
}
