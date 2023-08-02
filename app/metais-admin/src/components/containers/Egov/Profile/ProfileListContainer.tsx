import React from 'react'
import { AttributeProfilePreview, useListAttrProfile1 } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common'

export interface IView {
    data?: void | AttributeProfilePreview | undefined
}

interface IProfileListContainer {
    View: React.FC<IView>
}

export const ProfileListContainer: React.FC<IProfileListContainer> = ({ View }) => {
    const { data, isLoading, isError } = useListAttrProfile1({
        // role: '',
    })

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={data} />
        </QueryFeedback>
    )
}
