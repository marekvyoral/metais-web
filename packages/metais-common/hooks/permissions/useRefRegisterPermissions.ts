import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions, RR_MANAGER } from './useUserAbility'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { ApiReferenceRegisterState } from '@isdd/metais-common/api/generated/reference-registers-swagger'

export const useRefRegisterPermissions = (state: ApiReferenceRegisterState | undefined) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()
    const hasPermissions = user?.roles?.some((role) => role === RR_MANAGER)

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        if (hasPermissions) {
            if (state === ApiReferenceRegisterState.IN_CONSTRUCTION) can(Actions.EDIT, `refRegisters`)
            can(Actions.CHANGE_STATES, 'refRegisters')
            can(Actions.CREATE, 'refRegisters')
        }
        abilityContext.update(rules)
    }, [abilityContext, hasPermissions, state])
    return {}
}
