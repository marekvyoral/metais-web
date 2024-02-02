import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { MembershipData, useFindMembershipData } from '@isdd/metais-common/api/generated/iam-swagger'
import { KSISVS_ROLES, GROUP_ROLES } from '@isdd/metais-common/constants/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useGroupsPermissions = (groupId?: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()
    const identityUuid = user?.uuid
    const { data: membershipData, isError, isLoading } = useFindMembershipData(identityUuid ?? '')

    useEffect(() => {
        const myRoles = user?.roles ?? []
        const userGroupData = membershipData?.membershipData?.find((item: MembershipData) => item.groupUuid == groupId)

        const { can, rules } = new AbilityBuilder(createMongoAbility)

        const canCreateGroup =
            myRoles?.includes(KSISVS_ROLES.STD_KSPRE) || myRoles?.includes(KSISVS_ROLES.STD_KSPODP) || myRoles?.includes(KSISVS_ROLES.STD_KSTAJ)
        const canEditGroup =
            myRoles?.includes(KSISVS_ROLES.STD_KSPRE) ||
            myRoles?.includes(KSISVS_ROLES.STD_KSPODP) ||
            myRoles?.includes(KSISVS_ROLES.STD_KSTAJ) ||
            userGroupData?.roleName === GROUP_ROLES.STD_PSPRE ||
            userGroupData?.roleName === GROUP_ROLES.STD_PSPODP
        const canEditGroupMaster =
            myRoles?.includes(KSISVS_ROLES.STD_KSPRE) || myRoles?.includes(KSISVS_ROLES.STD_KSPODP) || myRoles?.includes(KSISVS_ROLES.STD_KSTAJ)
        const canSeeMemberEmail =
            userGroupData?.showEmail ||
            userGroupData?.roleName === GROUP_ROLES.STD_PSPRE ||
            myRoles?.includes(KSISVS_ROLES.STD_KSPRE) ||
            myRoles?.includes(KSISVS_ROLES.STD_KSPODP) ||
            myRoles?.includes(KSISVS_ROLES.STD_KSTAJ)
        const canSendEmail = userGroupData || myRoles?.includes(KSISVS_ROLES.STD_KOORDINATOR_AGENDY)

        if (canCreateGroup) can(Actions.CREATE, 'groups')
        if (canEditGroup) can(Actions.EDIT, 'groups')
        if (canEditGroupMaster) can(Actions.EDIT, 'groupMaster')
        if (canSeeMemberEmail) can(Actions.READ, 'groupMemberEmail')
        if (canSendEmail) can(Actions.CREATE, 'sendEmail')

        abilityContext.update(rules)
    }, [abilityContext, groupId, membershipData, user?.roles])
    return { isLoading, isError }
}
