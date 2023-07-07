import React from 'react'

import { CiType, AttributeProfile } from '../../api'

interface IEntityDetailViewAttributes {
    data: CiType | AttributeProfile | undefined
    removeProfileAttribute?: (technicalName: string) => void
}

export const getTabsFromApi = (
    keysToDisplay: Map<string, CiType | AttributeProfile | undefined>,
    View: React.FC<IEntityDetailViewAttributes>,
    removeProfileAttribute?: (technicalName: string) => void,
) => {
    const tabsNames = Array.from(keysToDisplay?.keys())

    const tabsFromApi = tabsNames?.map((key) => {
        const tabData = keysToDisplay?.get(key)
        return {
            id: key,
            title: key,
            content: <View data={tabData} removeProfileAttribute={removeProfileAttribute} />,
        }
    })
    return tabsFromApi
}
