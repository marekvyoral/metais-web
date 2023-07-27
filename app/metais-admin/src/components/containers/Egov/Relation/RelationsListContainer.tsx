import React from 'react'
import { RelationshipTypePreviewList, useListRelationshipTypes } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common'

export interface IView {
    data?: RelationshipTypePreviewList | undefined
}

interface IRelationListContainer {
    View: React.FC<IView>
}

export const RelationListContainer: React.FC<IRelationListContainer> = ({ View }) => {
    const { data, isLoading, isError } = useListRelationshipTypes({ filter: {} })

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={data} />
        </QueryFeedback>
    )
}
