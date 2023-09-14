import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { RelatedCiTypePreview } from '@isdd/metais-common/api'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useCanCreateRelationTypeUnderOrgAndRole = (
    selectedOrganizationId: string,
    selectedRoleName: string,
    selectedCiRelationType: RelatedCiTypePreview | undefined,
) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()

    const relationTypeRoles = selectedCiRelationType?.relationshipRoleList
    const hasRoleToCreateRelationType = !!relationTypeRoles?.find((roleName) => roleName === selectedRoleName)

    const groupData = user?.groupData
    const hasOrgPermission = !!groupData?.find((group) => group.orgId === selectedOrganizationId)

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        //CAN CREATE UNDER THIS ORG
        if (hasOrgPermission) can(Actions.CREATE, `ci.create.org`)

        //CAN CREATE THIS RELATION TYPE
        if (hasRoleToCreateRelationType) can(Actions.CREATE, `ci.create.newRelationType`)

        abilityContext.update(rules)
    }, [abilityContext, hasOrgPermission, hasRoleToCreateRelationType])

    return {}
}
