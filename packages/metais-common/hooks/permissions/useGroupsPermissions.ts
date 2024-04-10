import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { MembershipData, useFindMembershipData } from '@isdd/metais-common/api/generated/iam-swagger'
import { KSISVS_ROLES, GROUP_ROLES, ROLES } from '@isdd/metais-common/constants/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export enum GroupPermissionSubject {
    GROUPS = 'groups',
    GROUP_MASTER = 'groupMaster',
    GROUP_MEMBER_EMAIL = 'groupMemberEmail',
    SEND_EMAIL = 'sendEmail',
    SEE_MEMBERS = 'seeMembers',
}

export const useGroupsPermissions = (groupId?: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()
    const identityUuid = user?.uuid
    const { data: membershipData, isError, isLoading, fetchStatus } = useFindMembershipData(identityUuid ?? '')

    useEffect(() => {
        const myRoles = user?.roles ?? []
        const userGroupData = membershipData?.membershipData?.find((item: MembershipData) => item.groupUuid == groupId)

        const { can, rules } = new AbilityBuilder(createMongoAbility)

        const hasSTD_KOORDINATOR_AGENDY = myRoles?.includes(KSISVS_ROLES.STD_KOORDINATOR_AGENDY)
        const hasSTD_KSTAJ = myRoles?.includes(KSISVS_ROLES.STD_KSTAJ)
        const hasKSPODP = myRoles?.includes(KSISVS_ROLES.STD_KSPODP)
        const hasKSPRE = myRoles?.includes(KSISVS_ROLES.STD_KSPRE)
        const hasPSPREGroup = userGroupData?.roleName === GROUP_ROLES.STD_PSPRE
        const hasPSPODPGroup = userGroupData?.roleName === GROUP_ROLES.STD_PSPODP
        const isAdmin = myRoles?.includes(ROLES.R_ADMIN)

        const canDeleteGroup = hasSTD_KOORDINATOR_AGENDY || isAdmin
        const canCreateGroup = hasKSPRE || hasKSPODP || hasSTD_KSTAJ || hasSTD_KOORDINATOR_AGENDY
        const canEditGroup = hasKSPRE || hasKSPODP || hasSTD_KSTAJ || hasPSPREGroup || hasPSPODPGroup || hasSTD_KOORDINATOR_AGENDY
        const canEditGroupMaster = hasKSPRE || hasKSPODP || hasSTD_KSTAJ || hasSTD_KOORDINATOR_AGENDY
        const canSendEmail = userGroupData || hasSTD_KOORDINATOR_AGENDY
        const canSeeMemberEmail = userGroupData?.showEmail || hasPSPREGroup || hasKSPRE || hasKSPODP || hasSTD_KSTAJ || hasSTD_KOORDINATOR_AGENDY
        const canSeeMembers = isAdmin && (hasPSPODPGroup || hasPSPREGroup || hasKSPRE || hasKSPODP || hasSTD_KSTAJ || hasSTD_KOORDINATOR_AGENDY)

        if (canCreateGroup) can(Actions.CREATE, GroupPermissionSubject.GROUPS)
        if (canEditGroup) can(Actions.EDIT, GroupPermissionSubject.GROUPS)
        if (canEditGroupMaster) can(Actions.EDIT, GroupPermissionSubject.GROUP_MASTER)
        if (canSeeMemberEmail) can(Actions.READ, GroupPermissionSubject.GROUP_MEMBER_EMAIL)
        if (canSendEmail) can(Actions.CREATE, GroupPermissionSubject.SEND_EMAIL)
        if (canDeleteGroup) can(Actions.DELETE, GroupPermissionSubject.GROUPS)
        if (canSeeMembers) can(Actions.READ, GroupPermissionSubject.SEE_MEMBERS)

        abilityContext.update(rules)
    }, [abilityContext, groupId, membershipData, user?.roles])
    return { isLoading: isLoading && fetchStatus != 'idle', isError }
}
