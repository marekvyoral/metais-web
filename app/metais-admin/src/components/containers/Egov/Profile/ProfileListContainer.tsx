import React from 'react'

import { AttributeProfilePreview, useListAttrProfileUsingPOST } from '@/api'
export interface IView {
    data?: void | AttributeProfilePreview | undefined
    isLoading: boolean
    isError: boolean
}

interface IProfileListContainer {
    View: React.FC<IView>
}

export const ProfileListContainer: React.FC<IProfileListContainer> = ({ View }) => {
    // const defaultListQueryArgs: CiTypeFilter = {
    //     role: '',
    // }

    // const [listQueryArgs, setListQueryArgs] = useState<CiTypeFilter>(defaultListQueryArgs)
    // listQueryArgs
    const { data, isLoading, isError } = useListAttrProfileUsingPOST({})

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={data} isLoading={isLoading} isError={isError} />
}
