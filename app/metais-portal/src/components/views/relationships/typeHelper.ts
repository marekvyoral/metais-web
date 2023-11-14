import { RelatedCiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'

enum CATEGORY_ENUM {
    NOT_VISIBLE = 'NO',
    READ_ONLY_BDA = 'ROCB',
    READ_ONLY = 'RONCB',
    READ_WRITE = 'RWNCB',
    READ_WRITE_BDA = 'RWCB',
}
enum TYPES {
    SYSTEM = 'system',
}
const NOT_PUBLIC_ENTITIES = ['MiestoPrevadzky']
export const isRelatedCiTypeCmdbView = (type: RelatedCiTypePreview, isLogged: boolean): boolean => {
    const isValid = type.ciTypeValid === true && type.relationshipTypeValid === true
    const isCategory = type.ciCategory !== CATEGORY_ENUM.NOT_VISIBLE && type.relationshipCategory !== CATEGORY_ENUM.NOT_VISIBLE
    const isTypeOk = type.ciTypeUsageType !== TYPES.SYSTEM && type.relationshipTypeUsageType !== TYPES.SYSTEM
    const isViewForLogged = isLogged || NOT_PUBLIC_ENTITIES.indexOf(type.ciTypeTechnicalName || '') === -1

    return isValid && isCategory && isTypeOk && isViewForLogged
}
