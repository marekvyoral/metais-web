import { RelatedCiTypePreview } from '@isdd/metais-common/api'
import { CATEGORY_ENUM, NOT_PUBLIC_ENTITIES, TYPES_ENUM, connectedCiTabsToRemove } from '@isdd/metais-common/hooks/common/constants'

export const removeDuplicates = <T>(arr: T[], by: keyof T | undefined = undefined) => {
    const propertyList = by && arr.map((item) => item[by])
    const filtered = propertyList
        ? arr.filter((item, index) => !propertyList.includes(item[by], index + 1))
        : arr.filter((item, index, array) => !array.includes(item, index + 1))
    return filtered
}

export const isInBlackList = (relatedCiType: RelatedCiTypePreview): boolean => {
    if (relatedCiType.ciTypeTechnicalName == undefined) {
        return false
    }
    const isContainedInBlacList = connectedCiTabsToRemove.includes(relatedCiType.ciTypeTechnicalName)
    return isContainedInBlacList
}

export const isRelatedCiTypeCmdbView = (relatedCiType: RelatedCiTypePreview, isLogged: boolean): boolean => {
    const isValid = relatedCiType.ciTypeValid === true && relatedCiType.relationshipTypeValid === true
    const isCategory = relatedCiType.ciCategory !== CATEGORY_ENUM.NOT_VISIBLE && relatedCiType.relationshipCategory !== CATEGORY_ENUM.NOT_VISIBLE
    const isTypeOk = relatedCiType.ciTypeUsageType !== TYPES_ENUM.SYSTEM && relatedCiType.relationshipTypeUsageType !== TYPES_ENUM.SYSTEM
    const isViewForLogged = isLogged || NOT_PUBLIC_ENTITIES.indexOf(relatedCiType.ciTypeTechnicalName || '') === -1
    const isNotBlacklisted = !isInBlackList(relatedCiType)
    return isValid && isCategory && isTypeOk && isViewForLogged && isNotBlacklisted
}
