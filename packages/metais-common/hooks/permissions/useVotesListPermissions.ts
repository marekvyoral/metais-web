import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { CAN_CREATE_AND_EDIT_VOTES_USER_ROLES } from '@isdd/metais-common/constants'

export enum Actions {
    CREATE = 'create',
    EDIT = 'edit',
}

const hasRoles = (userRoles: string[], testedRoles: string[]) => {
    return userRoles.some((role) => {
        return testedRoles.indexOf(role) >= 0
    })
}

export const useVotesListPermissions = () => {
    const abilityContext = useAbilityContext()

    const {
        state: { user },
    } = useAuth()

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const isLoggedIn = !!user
        const canCreateVote = hasRoles(user?.roles ?? [], CAN_CREATE_AND_EDIT_VOTES_USER_ROLES)

        if (canCreateVote && isLoggedIn) {
            can(Actions.CREATE, 'VOTE')
            can(Actions.EDIT, 'VOTE')
        }

        abilityContext.update(rules)
    }, [abilityContext, user])

    return {}
}
