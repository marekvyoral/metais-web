import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export enum RequestListActions {
    SHOW = 'show',
    CREATE = 'create',
    EDIT = 'edit',
}

export enum Roles {
    SZCHLGES = 'SZC_HLGES',
    SZCVEDGES = 'SZC_VEDGES',
}
export const useRequestPermissions = (entityName: string) => {
    const abilityContext = useAbilityContext()
    const auth = useAuth()

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const myRoles = auth?.state?.user?.roles ?? []
        const hasPermission = myRoles.find((role) => role === Roles.SZCHLGES || role === Roles.SZCVEDGES)

        if (hasPermission) {
            can(RequestListActions.SHOW, entityName)
            can(RequestListActions.CREATE, entityName)
            can(RequestListActions.EDIT, entityName)
        }

        abilityContext.update(rules)
    }, [auth, abilityContext, entityName])
    return {}
}
