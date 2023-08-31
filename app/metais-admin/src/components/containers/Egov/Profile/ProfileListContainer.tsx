import { QueryFeedback } from '@isdd/metais-common'
import { AttributeProfile, useListAttrProfile1 } from '@isdd/metais-common/api'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'

export interface IView {
    data?: AttributeProfile[] | undefined
}

interface IProfileListContainer {
    View: React.FC<IView>
    defaultFilterValues?: EntityFilterData
}

export const ProfileListContainer: React.FC<IProfileListContainer> = ({ View, defaultFilterValues }) => {
    const { data, isLoading, isError } = useListAttrProfile1({
        // role: '',
    })

    const { filter } = useFilterParams(defaultFilterValues ?? {})
    const filteredData = !defaultFilterValues ? data?.attributeProfileList : filterEntityData(filter, data?.attributeProfileList)
    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={filteredData} />
        </QueryFeedback>
    )
}
