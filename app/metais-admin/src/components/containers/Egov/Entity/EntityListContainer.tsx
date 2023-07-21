import React, { useState } from 'react'
import { CiTypeFilter, CiTypePreviewList, useListCiTypes, ListCiTypesParams } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common'

export interface IView {
    data?: CiTypePreviewList
}

interface IEntityListContainer {
    View: React.FC<IView>
}

export const EntityListContainer: React.FC<IEntityListContainer> = ({ View }) => {
    const defaultListQueryArgs: CiTypeFilter = {
        role: 'admin',
        roles: [],
    }

    const [listQueryArgs] = useState<CiTypeFilter>(defaultListQueryArgs)
    const listParams: ListCiTypesParams = { filter: listQueryArgs }
    const { data, isLoading, isError } = useListCiTypes(listParams)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={data} />
        </QueryFeedback>
    )
}
