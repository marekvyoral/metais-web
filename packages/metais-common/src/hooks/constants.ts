import { RelatedCiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const MEASURE_UNIT = 'MERNA_JEDNOTKA'

export enum CATEGORY_ENUM {
    NOT_VISIBLE = 'NO',
    READ_ONLY_BDA = 'ROCB',
    READ_ONLY = 'RONCB',
    READ_WRITE = 'RWNCB',
    READ_WRITE_BDA = 'RWCB',
}
export enum TYPES_ENUM {
    SYSTEM = 'system',
}
export const NOT_PUBLIC_ENTITIES = ['MiestoPrevadzky']

export const isRelatedCiTypeCmdbView = (type: RelatedCiTypePreview, isLogged: boolean): boolean => {
    const isValid = type.ciTypeValid === true && type.relationshipTypeValid === true
    const isCategory = type.ciCategory !== CATEGORY_ENUM.NOT_VISIBLE && type.relationshipCategory !== CATEGORY_ENUM.NOT_VISIBLE
    const isTypeOk = type.ciTypeUsageType !== TYPES_ENUM.SYSTEM && type.relationshipTypeUsageType !== TYPES_ENUM.SYSTEM
    const isViewForLogged = isLogged || NOT_PUBLIC_ENTITIES.indexOf(type.ciTypeTechnicalName || '') === -1

    return isValid && isCategory && isTypeOk && isViewForLogged
}
