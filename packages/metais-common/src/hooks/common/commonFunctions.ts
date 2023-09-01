import { CATEGORY_ENUM, NOT_PUBLIC_ENTITIES, TYPES_ENUM } from '@/hooks/common/constants'
import { RelatedCiTypePreview } from '@isdd/metais-common/api'

export const removeDuplicates = <T>(arr: T[], by: keyof T | undefined = undefined) => {
    const propertyList = by && arr.map((item) => item[by])
    const filtered = propertyList
        ? arr.filter((item, index) => !propertyList.includes(item[by], index + 1))
        : arr.filter((item, index, array) => !array.includes(item, index + 1))
    return filtered
}

export const isRelatedCiTypeCmdbView = (type: RelatedCiTypePreview, isLogged: boolean): boolean => {
    const isValid = type.ciTypeValid === true && type.relationshipTypeValid === true
    const isCategory = type.ciCategory !== CATEGORY_ENUM.NOT_VISIBLE && type.relationshipCategory !== CATEGORY_ENUM.NOT_VISIBLE
    const isTypeOk = type.ciTypeUsageType !== TYPES_ENUM.SYSTEM && type.relationshipTypeUsageType !== TYPES_ENUM.SYSTEM
    const isViewForLogged = isLogged || NOT_PUBLIC_ENTITIES.indexOf(type.ciTypeTechnicalName || '') === -1

    return isValid && isCategory && isTypeOk && isViewForLogged
}
