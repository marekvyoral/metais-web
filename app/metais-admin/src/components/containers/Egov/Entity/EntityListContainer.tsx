import React, { useState } from 'react'

import { CiTypeFilter, CiTypePreviewList, useListCiTypesUsingGET } from '@/api/generated/types-repo-swagger'

export interface IView {
    data?: CiTypePreviewList
    isLoading: boolean
    isError: boolean
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

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={data} isLoading={isLoading} isError={isError} />
}
