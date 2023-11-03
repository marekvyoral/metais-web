import { mapFilterToRefRegisters } from '@isdd/metais-common/api/filter/filterApi'
import { useGetFOPReferenceRegisterItems } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { transformColumnsMap, useFilterForCiList, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/index'
import { useMemo } from 'react'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { IRefRegisterItemsView } from '@/types/views'

interface IRefRegisterItemsContainer {
    entityId: string
    View: React.FC<IRefRegisterItemsView>
}

export const RefRegisterItemsContainer = ({ entityId, View }: IRefRegisterItemsContainer) => {
    const { filterParams, handleFilterChange } = useFilterForCiList({ pageNumber: BASE_PAGE_NUMBER, perPage: BASE_PAGE_SIZE })

    const {
        data: refRegisterItems,
        isLoading: refRegisterItemsLoading,
        isError: refRegisterItemsError,
    } = useGetFOPReferenceRegisterItems(entityId, mapFilterToRefRegisters(filterParams))
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType('ReferenceRegisterItem')

    const pagination = usePagination({ pagination: { totaltems: refRegisterItems?.apiReferenceRegisterItemsCount ?? 0 } }, filterParams)

    const referenceRegisterItemAttributes = useMemo(() => {
        return (
            ciTypeData?.attributes?.map((attr) => ({
                ...attr,
                technicalName: transformColumnsMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []
        )
    }, [ciTypeData])

    const isLoading = refRegisterItemsLoading || isCiTypeDataLoading
    const isError = refRegisterItemsError || isCiTypeDataError

    return (
        <View
            data={{
                refRegisterItems,
                referenceRegisterItemAttributes,
            }}
            handleFilterChange={handleFilterChange}
            pagination={pagination}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
