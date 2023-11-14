import { Group, User } from '@isdd/metais-common/contexts/auth/authContext'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'

enum CATEGORY_ENUM {
    NOT_VISIBLE = 'NO',
    READ_ONLY = 'ROCB',
    READ_WRITE = 'RWCB',
}

enum TYPES {
    SYSTEM = 'system',
}

export const isCiTypeUpdatable = (ciType?: CiType) => {
    return ciType && ciType.category === CATEGORY_ENUM.READ_WRITE && ciType.type !== TYPES.SYSTEM
}

export const canCreateCiForType = (ciType?: CiType) => {
    return ciType?.valid && isCiTypeUpdatable(ciType)
}

export const canGroupCreateCi = (authorityRoles: string[], group?: Group) => {
    const roles = group?.roles

    for (const role of roles ?? []) {
        if (authorityRoles?.indexOf(role?.roleName) > -1) return true
    }

    return false
}

export const canUserCreateCi = (user?: User, authorityRoles?: string[]) => {
    const groupData = user?.groupData

    for (const group of groupData ?? []) {
        if (canGroupCreateCi(authorityRoles ?? [], group)) return true
    }

    return false
}
