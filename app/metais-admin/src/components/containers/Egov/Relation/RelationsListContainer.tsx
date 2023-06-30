import React from 'react'

import { RelationshipTypePreviewList, useListRelationshipTypesUsingGET } from '@/api'
export interface IView {
    data?: RelationshipTypePreviewList | undefined
    isLoading: boolean
    isError: boolean
}

interface IRelationListContainer {
    View: React.FC<IView>
}

export const RelationListContainer: React.FC<IRelationListContainer> = ({ View }) => {
    // const defaultListQueryArgs: CiTypeFilter = {
    //     role: '',
    // }

    // const [listQueryArgs, setListQueryArgs] = useState<CiTypeFilter>(defaultListQueryArgs)

    const { data, isLoading, isError } = useListRelationshipTypesUsingGET({})

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={data} isLoading={isLoading} isError={isError} />
}
