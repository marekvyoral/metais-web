import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

export const useCanCreateRelationTypeUnderOrgAndRole = (selectedRoleName: string, rolesToCompareWith: string[]) => {
    const abilityContext = useAbilityContext()

    const hasRoleToCreateRelationType = !!rolesToCompareWith?.find((roleName) => roleName === selectedRoleName)

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        //CAN CREATE THIS RELATION TYPE
        if (hasRoleToCreateRelationType) can(Actions.CREATE, `ci.create.newRelationType`)

        abilityContext.update(rules)
    }, [abilityContext, hasRoleToCreateRelationType])

    return {}
}
