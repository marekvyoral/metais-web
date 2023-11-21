import React from 'react'

import { CiType, AttributeProfile, Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FindAll11200 } from '@isdd/metais-common/api/generated/iam-swagger'

export interface IEntityDetailViewAttributes {
    roles?: FindAll11200
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
    roles?: FindAll11200 | undefined,
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
                    roles={roles}
                />
            ),
        }
    })
    return tabsFromApi
}
