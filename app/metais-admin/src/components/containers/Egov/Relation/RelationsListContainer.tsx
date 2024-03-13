import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { RelationshipTypePreview, useListRelationshipTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { RELATIONSHIP_TYPES_QUERY_KEY } from '@isdd/metais-common/constants'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
    const { i18n } = useTranslation()
    const { data, isLoading, isError } = useListRelationshipTypes(
        { filter: {} },
        { query: { queryKey: [RELATIONSHIP_TYPES_QUERY_KEY, i18n.language] } },
    )
    const { filter } = useFilterParams(defaultFilterValues)
    const filteredData = filterEntityData(filter, data?.results)
    const [sort, setSort] = useState<ColumnSort[]>([])
    return <View data={filteredData} isLoading={isLoading} isError={isError} setSort={setSort} sort={sort} />
}
