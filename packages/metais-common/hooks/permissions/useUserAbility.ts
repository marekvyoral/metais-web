import { AbilityBuilder, createMongoAbility } from '@casl/ability'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { canCreateCiForType, canUserCreateCi } from '@isdd/metais-common/permissions/ci'
import { STANDARDIZATION_DRAFTS_LIST } from '@isdd/metais-common/constants'

export enum Actions {
    READ = 'read',
    EXPORT = 'export',
    IMPORT = 'import',
    SELECT_COLUMNS = 'selectColumns',
    CREATE = 'create',
    EDIT = 'edit',
    CHANGE_OWNER = 'change_owner',
    HISTORY = 'history',
    BULK_ACTIONS = 'bulk_actions',
    CHANGE_STATES = 'change_states',
    HAS_ROLE = 'has_role',
    DELETE = 'DELETE',
    APPROVE_KRIS = 'APPROVE_KRIS',
    KRIS_SUBSCRIBE = 'KRIS_PODPIS',
    KRIS_SEND_APPROVING = 'KRIS_SEND_APPROVING',
}

export const ADMIN = 'R_ADMIN'
export const RR_MANAGER = 'RR_MANAGER'
export const RR_ADMIN_MFSR = 'RR_ADMIN_MFSR'

export const CANNOT_READ_ENTITY = ['ulohy', 'notifications', 'data-objects/requestlist', 'public-authorities-hierarchy']
export const CAN_CREATE_WITHOUT_LOGIN = [STANDARDIZATION_DRAFTS_LIST]

const defineAbilityForUser = (roles: string[] = [], entityName: string, create?: boolean) => {
    const { can, build } = new AbilityBuilder(createMongoAbility)

    if (roles.includes(ADMIN)) {
        can(Actions.READ, entityName)
        can(Actions.CREATE, entityName)
        can(Actions.EXPORT, entityName)
        can(Actions.IMPORT, entityName)
        can(Actions.SELECT_COLUMNS, entityName)
        can(Actions.HISTORY, entityName)
        can(Actions.BULK_ACTIONS, entityName)
    } else if (roles?.length > 0) {
        can(Actions.READ, entityName)
        if (create) can(Actions.CREATE, entityName)
        can(Actions.EXPORT, entityName)
        can(Actions.IMPORT, entityName)
        can(Actions.SELECT_COLUMNS, entityName)
        can(Actions.BULK_ACTIONS, entityName)
    }

    if (entityName === STANDARDIZATION_DRAFTS_LIST) can(Actions.CREATE, 'ci')

    return build()
}

export const useUserAbility = (entityName?: string) => {
    const {
        state: { user },
    } = useAuth()

    return defineAbilityForUser(user?.roles, entityName ?? 'ci')
}

export const useCreateCiAbility = (ciType?: CiType, entityName?: string) => {
    const {
        state: { user },
    } = useAuth()

    if (ciType && canCreateCiForType(ciType)) {
        return defineAbilityForUser(user?.roles, entityName ?? 'ci', canUserCreateCi(user ?? undefined, ciType?.roleList))
    }
    return defineAbilityForUser(user?.roles, entityName ?? 'ci')
}
