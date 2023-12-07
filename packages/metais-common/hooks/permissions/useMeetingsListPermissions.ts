import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { CAN_CREATE_MEETING_USER_ROLES } from '@isdd/metais-common/constants'

export enum Actions {
    CREATE = 'create',
    EDIT = 'edit',
}

export enum Subject {
    MEETING = 'MEETING',
}

const hasRoles = (userRoles: string[], testedRoles: string[]) => {
    return userRoles.some((role) => {
        return testedRoles.indexOf(role) >= 0
    })
}

export const useMeetingsListPermissions = () => {
    const abilityContext = useAbilityContext()

    const {
        state: { user },
    } = useAuth()

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const isLoggedIn = !!user
        const canCreateVote = hasRoles(user?.roles ?? [], CAN_CREATE_MEETING_USER_ROLES)

        if (canCreateVote && isLoggedIn) {
            can(Actions.CREATE, Subject.MEETING)
        }

        abilityContext.update(rules)
    }, [abilityContext, user])

    return {}
}
