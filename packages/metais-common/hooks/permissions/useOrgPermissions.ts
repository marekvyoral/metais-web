import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useOrgPermissions = (selectedOrganizationId: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()
    const groupData = user?.groupData
    const hasOrgPermission = !!groupData?.find((group) => group.orgId === selectedOrganizationId)

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        if (hasOrgPermission) can(Actions.CREATE, `ci.create.org`)
        abilityContext.update(rules)
    }, [abilityContext, hasOrgPermission])
    return {}
}
