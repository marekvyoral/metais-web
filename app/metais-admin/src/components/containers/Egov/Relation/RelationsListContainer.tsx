import { QueryFeedback } from '@isdd/metais-common'
import { RelationshipTypePreview, useListRelationshipTypes } from '@isdd/metais-common/api'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'

export interface IView {
    data?: RelationshipTypePreview[] | undefined
}

interface IRelationListContainer {
    View: React.FC<IView>
    defaultFilterValues: EntityFilterData
}

export const RelationListContainer: React.FC<IRelationListContainer> = ({ View, defaultFilterValues }) => {
    const { data, isLoading, isError } = useListRelationshipTypes({ filter: {} })
    const { filter } = useFilterParams(defaultFilterValues)
    const filteredData = filterEntityData(filter, data?.results)
    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={filteredData} />
        </QueryFeedback>
    )
}
