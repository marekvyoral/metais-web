import { UseQueryResult, useQueries } from '@tanstack/react-query'
import { FieldValues } from 'react-hook-form'
import { IFilter } from '@isdd/idsk-ui-kit/src/types'

import { BASE_PAGE_SIZE, ConfigurationItemSetUi, useReadCiList1Hook } from '@isdd/metais-common/api'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

export const useCiListBulk = (typeList: (string | undefined)[], filterParams: FieldValues & IFilterParams & IFilter) => {
    const readCiList1 = useReadCiList1Hook()

    const resultList: UseQueryResult<ConfigurationItemSetUi, unknown>[] = useQueries({
        queries: typeList.map((type: string | undefined) => {
            const filterParamsOfType = type ? filterParams?.[type] : {}

            const queryOptions = {
                filter: {
                    type: [type ?? ''],
                    metaAttributes: {
                        state: ['DRAFT', 'APPROVED_BY_OWNER'],
                    },
                    fullTextSearch: filterParamsOfType?.fullTextSearch,
                },
                page: filterParamsOfType?.pageNumber ?? 1,
                perpage: BASE_PAGE_SIZE,
                sortBy: 'Gen_Profil_nazov',
                sortType: 'ASC',
            }

            return {
                queryKey: ['reportList', queryOptions],
                queryFn: () => readCiList1(queryOptions),
                enabled: !!type,
            }
        }),
    })

    const isLoading = resultList.some((item) => item.isLoading)
    const isError = resultList.some((item) => item.isError)
    const data = resultList?.map((result) => result?.data)
    return {
        isLoading,
        isError,
        data,
    }
}
