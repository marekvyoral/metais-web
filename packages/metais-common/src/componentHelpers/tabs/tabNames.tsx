import React from 'react'

import { CiType, AttributeProfile, Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

export interface IEntityDetailViewAttributes {
    data: CiType | AttributeProfile | undefined
    attributesOverridesData?: Attribute[] | undefined
    removeProfileAttribute?: (technicalName: string) => void
    saveExistingAttribute?: (attributeTechnicalName?: string, attribute?: Attribute) => void
    resetExistingAttribute?: (attributeTechnicalName?: string) => void
}

export const getTabsFromApi = (
    keysToDisplay: Map<string, CiType | AttributeProfile | undefined>,
    View: React.FC<IEntityDetailViewAttributes>,
    attributesOverridesData?: Attribute[] | undefined,
    removeProfileAttribute?: (technicalName: string) => void,
    saveExistingAttribute?: (attributeTechnicalName?: string, attribute?: Attribute) => void,
    resetExistingAttribute?: (attributeTechnicalName?: string) => void,
) => {
    const tabsNames = Array.from(keysToDisplay?.keys())

    const tabsFromApi = tabsNames?.map((key) => {
        const tabData = keysToDisplay?.get(key)

        return {
            id: key,
            title: key,
            content: (
                <View
                    data={tabData}
                    attributesOverridesData={attributesOverridesData}
                    removeProfileAttribute={removeProfileAttribute}
                    saveExistingAttribute={saveExistingAttribute}
                    resetExistingAttribute={resetExistingAttribute}
                />
            ),
        }
    })
    return tabsFromApi
}
