import React, { useState } from 'react'
import { CiTypeFilter, CiTypePreviewList, useListCiTypesUsingGET } from '@isdd/metais-common/api'
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

    const { data, isLoading, isError } = useListCiTypesUsingGET(listQueryArgs)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={data} />
        </QueryFeedback>
    )
}
