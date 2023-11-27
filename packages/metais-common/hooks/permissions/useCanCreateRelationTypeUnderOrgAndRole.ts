import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const useCanCreateRelationTypeUnderOrgAndRole = (selectedRoleName: string, selectedCiRelationType: RelationshipType | undefined) => {
    const abilityContext = useAbilityContext()

    const relationTypeRoles = selectedCiRelationType?.roleList
    const hasRoleToCreateRelationType = !!relationTypeRoles?.find((roleName) => roleName === selectedRoleName)

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        //CAN CREATE THIS RELATION TYPE
        if (hasRoleToCreateRelationType) can(Actions.CREATE, `ci.create.newRelationType`)

        abilityContext.update(rules)
    }, [abilityContext, hasRoleToCreateRelationType])

    return {}
}
