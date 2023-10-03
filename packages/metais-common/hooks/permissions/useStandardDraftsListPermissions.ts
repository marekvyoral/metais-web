import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useStandardDraftsListPermissions = () => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        can(Actions.EDIT, `DraftsList`)
        can(Actions.CHANGE_STATES, 'DraftsList')
        can(Actions.CREATE, 'DraftsList')
        abilityContext.update(rules)
    }, [abilityContext])
    return {}
}
