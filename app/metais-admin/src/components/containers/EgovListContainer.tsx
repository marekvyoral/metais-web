import React, { useState } from 'react'

import { CiTypeFilter, CiTypePreviewList, useListCiTypesUsingGET } from '@/api/generated/types-repo-swagger'

export interface IView {
    data?: CiTypePreviewList
    isLoading: boolean
    isError: boolean
}

interface IEgovListContainer {
    View: React.FC<IView>
}

export const EgovListContainer: React.FC<IEgovListContainer> = ({ View }) => {
    const defaultListQueryArgs: CiTypeFilter = {
        role: 'admin',
        roles: [],
    }

    const [listQueryArgs, setListQueryArgs] = useState<CiTypeFilter>(defaultListQueryArgs)

    const { data, isLoading, isError } = useListCiTypesUsingGET(listQueryArgs)

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={data} isLoading={isLoading} isError={isError} />
}
