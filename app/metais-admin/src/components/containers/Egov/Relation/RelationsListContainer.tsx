import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { RelationshipTypePreview, useListRelationshipTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { SetStateAction, useState } from 'react'

export interface IView {
    data?: RelationshipTypePreview[] | undefined
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
    setSort: React.Dispatch<SetStateAction<ColumnSort[]>>
}

interface IRelationListContainer {
    View: React.FC<IView>
    defaultFilterValues: EntityFilterData
}

export const RelationListContainer: React.FC<IRelationListContainer> = ({ View, defaultFilterValues }) => {
    const { data, isLoading, isError } = useListRelationshipTypes({ filter: {} })
    const { filter } = useFilterParams(defaultFilterValues)
    const filteredData = filterEntityData(filter, data?.results)
    const [sort, setSort] = useState<ColumnSort[]>([])
    return <View data={filteredData} isLoading={isLoading} isError={isError} setSort={setSort} sort={sort} />
}
