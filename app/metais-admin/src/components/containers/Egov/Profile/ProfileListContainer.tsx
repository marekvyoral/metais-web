import {
    AttributeProfile,
    AttributeProfilePreview,
    useListAttrProfile1,
    useListGenericAttrProfile,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult } from '@tanstack/react-query'
import React from 'react'

export interface IView {
    data?: AttributeProfile[] | undefined
    refetch?: () => Promise<QueryObserverResult<AttributeProfilePreview, unknown>>
    isFetching?: boolean
    isLoading: boolean
    isError: boolean
}

interface IProfileListContainer {
    View: React.FC<IView>
    defaultFilterValues?: EntityFilterData
}

export const ProfileListContainer: React.FC<IProfileListContainer> = ({ View, defaultFilterValues }) => {
    const { data, isLoading, isError, isFetching, refetch } = useListAttrProfile1({
        // role: '',
    })
    const { data: genericData } = useListGenericAttrProfile({ filter: {} })
    const list: AttributeProfile[] = [...(data?.attributeProfileList ?? []), ...(genericData?.attributeProfileList ?? [])]
    const { filter } = useFilterParams(defaultFilterValues ?? {})
    const filteredData = !defaultFilterValues ? list : filterEntityData(filter, list)
    return <View data={filteredData} refetch={refetch} isFetching={isFetching} isLoading={isLoading} isError={isError} />
}
