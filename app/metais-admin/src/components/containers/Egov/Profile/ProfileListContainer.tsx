import { QueryFeedback } from '@isdd/metais-common'
import { AttributeProfile, AttributeProfilePreview, useListAttrProfile1 } from '@isdd/metais-common/api'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult } from '@tanstack/react-query'
import React from 'react'

export interface IView {
    data?: AttributeProfile[] | undefined
    refetch?: () => Promise<QueryObserverResult<AttributeProfilePreview, unknown>>
    isFetching?: boolean
}

interface IProfileListContainer {
    View: React.FC<IView>
    defaultFilterValues?: EntityFilterData
}

export const ProfileListContainer: React.FC<IProfileListContainer> = ({ View, defaultFilterValues }) => {
    const { data, isLoading, isError, isFetching, refetch } = useListAttrProfile1({
        // role: '',
    })

    const { filter } = useFilterParams(defaultFilterValues ?? {})
    const filteredData = !defaultFilterValues ? data?.attributeProfileList : filterEntityData(filter, data?.attributeProfileList)
    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={filteredData} refetch={refetch} isFetching={isFetching} />
        </QueryFeedback>
    )
}
