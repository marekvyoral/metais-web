import { CiTypeFilter, CiTypePreview, useListCiTypes } from '@isdd/metais-common/api'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { useState } from 'react'

export interface IView {
    data?: CiTypePreview[]
    isLoading: boolean
    isError: boolean
}

interface IEntityListContainer {
    View: React.FC<IView>
    defaultFilterValues?: EntityFilterData
}

export const EntityListContainer: React.FC<IEntityListContainer> = ({ View, defaultFilterValues }) => {
    const defaultListQueryArgs: CiTypeFilter = {
        role: 'admin',
        roles: [],
    }

    const [listQueryArgs] = useState<CiTypeFilter>(defaultListQueryArgs)

    const { data, isLoading, isError } = useListCiTypes({ filter: listQueryArgs })
    const { filter } = useFilterParams(defaultFilterValues ?? {})
    const filteredData = !defaultFilterValues ? data?.results : filterEntityData(filter, data?.results)
    return <View data={filteredData} isLoading={isLoading} isError={isError} />
}
