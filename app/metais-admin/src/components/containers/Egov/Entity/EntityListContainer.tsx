import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { CiTypeFilter, CiTypePreview, useListCiTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { CI_TYPES_QUERY_KEY } from '@isdd/metais-common/constants'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface IView {
    data?: CiTypePreview[]
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
    setSort: React.Dispatch<SetStateAction<ColumnSort[]>>
}

interface IEntityListContainer {
    View: React.FC<IView>
    defaultFilterValues?: EntityFilterData
}

export const EntityListContainer: React.FC<IEntityListContainer> = ({ View, defaultFilterValues }) => {
    const { i18n } = useTranslation()
    const defaultListQueryArgs: CiTypeFilter = {
        role: 'admin',
        roles: [],
    }

    const [listQueryArgs] = useState<CiTypeFilter>(defaultListQueryArgs)

    const { data, isLoading, isError } = useListCiTypes(
        { filter: listQueryArgs },
        { query: { queryKey: [CI_TYPES_QUERY_KEY, listQueryArgs, i18n.language] } },
    )
    const { filter } = useFilterParams(defaultFilterValues ?? {})
    const filteredData = !defaultFilterValues ? data?.results : filterEntityData(filter, data?.results)
    const [sort, setSort] = useState<ColumnSort[]>([])
    return <View data={filteredData} isLoading={isLoading} isError={isError} setSort={setSort} sort={sort} />
}
