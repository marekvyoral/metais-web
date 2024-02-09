import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import {
    AttributeProfile,
    AttributeProfilePreview,
    useListAttrProfile,
    useListGenericAttrProfile,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EntityFilterData, filterEntityData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult } from '@tanstack/react-query'
import React, { SetStateAction, useState } from 'react'

export interface IView {
    data?: AttributeProfile[] | undefined
    refetch?: () => Promise<QueryObserverResult<AttributeProfilePreview, unknown>>
    isFetching?: boolean
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
    setSort: React.Dispatch<SetStateAction<ColumnSort[]>>
}

interface IProfileListContainer {
    View: React.FC<IView>
    defaultFilterValues?: EntityFilterData
}

export const ProfileListContainer: React.FC<IProfileListContainer> = ({ View, defaultFilterValues }) => {
    const { data, isLoading, isError, isFetching, refetch } = useListAttrProfile({
        filter: {},
    })
    const { data: genericData } = useListGenericAttrProfile({ filter: {} })
    const list: AttributeProfile[] = [...(data?.attributeProfileList ?? []), ...(genericData?.attributeProfileList ?? [])]
    const { filter } = useFilterParams(defaultFilterValues ?? {})
    const filteredData = !defaultFilterValues ? list : filterEntityData(filter, list)
    const [sort, setSort] = useState<ColumnSort[]>([])
    return (
        <View data={filteredData} refetch={refetch} isFetching={isFetching} isLoading={isLoading} isError={isError} setSort={setSort} sort={sort} />
    )
}
