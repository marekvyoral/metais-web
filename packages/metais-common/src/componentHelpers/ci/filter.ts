import { DRAFT, INVALIDATED } from '@isdd/metais-common/constants'
import { FilterAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { FilterMetaAttributesUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

export const filterAttributesBasedOnIgnoreList = (filterAttributes: FilterAttribute[], ignoreListOfNames: string[]): FilterAttribute[] => {
    return filterAttributes.filter((item) => !ignoreListOfNames?.includes(item.name ?? ''))
}

export const getLiableEntityFromPreferences = (myPO: string | undefined) => {
    return myPO ? [myPO] : undefined
}

export const getStateFromPreferences = (showInvalidatedItems: boolean) => {
    return showInvalidatedItems ? [DRAFT, INVALIDATED] : [DRAFT]
}

type MetaAttribuesForFilterArgs = {
    myPO: string
    evidenceStatus: string[]
    showInvalidatedItems: boolean
    metaAttributeFilters: FilterMetaAttributesUi | undefined
}

export const getMetaAttributesForCiFilter = ({ myPO, metaAttributeFilters, showInvalidatedItems, evidenceStatus }: MetaAttribuesForFilterArgs) => {
    const liableEntity = getLiableEntityFromPreferences(myPO)
    const state = evidenceStatus?.length ? evidenceStatus : getStateFromPreferences(showInvalidatedItems)

    const metaAttributes = { state, liableEntity, ...metaAttributeFilters }
    return metaAttributes
}
