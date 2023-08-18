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
}

export const CANNOT_READ_ENTITY = ['ulohy', 'notifications']

const defineAbilityForUser = (roles: string[] = [], entityName: string, create?: boolean) => {
    const { can, build } = new AbilityBuilder(createMongoAbility)

    if (roles.includes('R_ADMIN')) {
        can(Actions.READ, entityName)
        can(Actions.CREATE, entityName)
        can(Actions.EXPORT, entityName)
        can(Actions.IMPORT, entityName)
        can(Actions.SELECT_COLUMNS, entityName)
    } else if (roles?.length > 0) {
        can(Actions.READ, entityName)
        if (create) can(Actions.CREATE, entityName)
        can(Actions.EXPORT, entityName)
        can(Actions.IMPORT, entityName)
        can(Actions.SELECT_COLUMNS, entityName)
    }

    return build()
}

export const useUserAbility = (entityName?: string) => {
    const {
        state: { user },
    } = useAuth()

    return defineAbilityForUser(user?.roles, entityName ?? 'ci')
}

export const useCreateCiAbility = (ciType?: CiType) => {
    const auth = useAuth()

    if (ciType && canCreateCiForType(ciType)) {
        return defineAbilityForUser(auth?.state?.user?.roles, 'ci', canUserCreateCi(auth?.state?.user ?? undefined, ciType?.roleList))
    }
    return defineAbilityForUser(auth.state.user?.roles, 'ci')
}
