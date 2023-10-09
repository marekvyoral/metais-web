import { AbilityBuilder, createMongoAbility } from '@casl/ability'

import { CiType } from '@isdd/metais-common/api'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { canCreateCiForType, canUserCreateCi } from '@isdd/metais-common/permissions/ci'

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
}

export const ADMIN = 'R_ADMIN'

export const CANNOT_READ_ENTITY = ['ulohy', 'notifications', 'codelists/list']
export const CAN_CREATE_WITHOUT_LOGIN = ['draftsList']

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

    if ((!roles || roles?.length === 0) && entityName === 'draftsList') can(Actions.CREATE, 'ci')

    return build()
}

export const useUserAbility = (entityName?: string) => {
    const {
        state: { user },
    } = useAuth()

    return defineAbilityForUser(user?.roles, entityName ?? 'ci')
}

export const useCreateCiAbility = (ciType?: CiType, entityName?: string) => {
    const auth = useAuth()

    if (ciType && canCreateCiForType(ciType)) {
        return defineAbilityForUser(auth?.state?.user?.roles, entityName ?? 'ci', canUserCreateCi(auth?.state?.user ?? undefined, ciType?.roleList))
    }
    return defineAbilityForUser(auth.state.user?.roles, entityName ?? 'ci')
}
