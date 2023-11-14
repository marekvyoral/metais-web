import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions, RR_ADMIN_MFSR, RR_MANAGER } from './useUserAbility'

import { ApiReferenceRegisterState } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useRefRegisterPermissions = (
    state: ApiReferenceRegisterState | undefined,
    owner: string | undefined,
    managerUuid: string | undefined,
) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()

    const hasRoleMFSR = () => {
        return user?.roles?.some((role) => role === RR_ADMIN_MFSR)
    }

    const isManager = user?.roles?.some((role) => role === RR_MANAGER)
    const userGroupData = user?.groupData
    const groupRoles = userGroupData?.flatMap((groupData) => groupData?.roles?.filter((role) => role?.roleName === RR_MANAGER))
    const groupRolesIds = groupRoles?.map((role) => role?.gid)

    const RRGroups = userGroupData?.filter((grp) => grp?.orgId === managerUuid)
    const RRGroupsRoles = RRGroups?.flatMap((grps) => grps?.roles)

    const isRROwner = !!groupRolesIds?.find((id) => id === owner)
    const isManagerRR = RRGroupsRoles?.find((role) => role?.roleName === RR_MANAGER)

    const canDelete = state === ApiReferenceRegisterState.IN_CONSTRUCTION && isManagerRR
    const canBackRRToConstruction = state !== ApiReferenceRegisterState.IN_CONSTRUCTION && hasRoleMFSR()
    const canMoveRRToReady = canDelete
    const canForwardRRToApproval = state === ApiReferenceRegisterState.READY_TO_APPROVAL && hasRoleMFSR()
    const canForwardRRToMPK =
        (state === ApiReferenceRegisterState.READY_TO_APPROVAL || state === ApiReferenceRegisterState.APPROVAL_IN_PROGRESS) && hasRoleMFSR()

    const canApproveRR =
        (state === ApiReferenceRegisterState.APPROVAL_IN_PROGRESS || state === ApiReferenceRegisterState.MPK_IN_PROGRESS) && hasRoleMFSR()

    const canRejectRR =
        (state === ApiReferenceRegisterState.READY_TO_APPROVAL ||
            state === ApiReferenceRegisterState.APPROVAL_IN_PROGRESS ||
            state === ApiReferenceRegisterState.PUBLISHED) &&
        hasRoleMFSR()

    const canChangeManagerPerms =
        (state === ApiReferenceRegisterState.READY_TO_APPROVAL ||
            state === ApiReferenceRegisterState.APPROVAL_IN_PROGRESS ||
            state === ApiReferenceRegisterState.PUBLISHED) &&
        isManagerRR
    const canChangeContact = isManagerRR || hasRoleMFSR()

    const canGenerateFile = (hasRoleMFSR() || isRROwner) && state !== ApiReferenceRegisterState.REJECTED
    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        if (isManagerRR) {
            if (state === ApiReferenceRegisterState.IN_CONSTRUCTION && isRROwner) can(Actions.EDIT, `refRegisters`)
        }

        if (!(!isManagerRR && state === ApiReferenceRegisterState.IN_CONSTRUCTION)) can(Actions.CHANGE_STATES, 'refRegisters')
        if (canGenerateFile) can(Actions.CREATE, 'refRegisters.generateProposition')
        if (canChangeContact) can(Actions.CREATE, 'refRegisters.changeContact')
        if (canChangeManagerPerms) can(Actions.CREATE, 'refRegisters.changeManagerInfo')
        if (canDelete) can(Actions.DELETE, 'refRegisters')
        if (canBackRRToConstruction) can(Actions.CHANGE_STATES, `refRegisters.${ApiReferenceRegisterState.IN_CONSTRUCTION}`)
        if (canMoveRRToReady) can(Actions.CHANGE_STATES, `refRegisters.${ApiReferenceRegisterState.READY_TO_APPROVAL}`)
        if (canForwardRRToApproval) can(Actions.CHANGE_STATES, `refRegisters.${ApiReferenceRegisterState.APPROVAL_IN_PROGRESS}`)
        if (canForwardRRToMPK) can(Actions.CHANGE_STATES, `refRegisters.${ApiReferenceRegisterState.MPK_IN_PROGRESS}`)
        if (canApproveRR) can(Actions.CHANGE_STATES, `refRegisters.${ApiReferenceRegisterState.PUBLISHED}`)
        if (canRejectRR) can(Actions.CHANGE_STATES, `refRegisters.${ApiReferenceRegisterState.REJECTED}`)

        if (isManager) {
            can(Actions.CREATE, 'refRegisters')
            if (state === ApiReferenceRegisterState.IN_CONSTRUCTION) can(Actions.EDIT, 'refRegisters.items')
        }
        abilityContext.update(rules)
    }, [
        abilityContext,
        state,
        isRROwner,
        isManagerRR,
        canGenerateFile,
        canChangeContact,
        canChangeManagerPerms,
        canDelete,
        canBackRRToConstruction,
        canMoveRRToReady,
        canForwardRRToApproval,
        canForwardRRToMPK,
        canApproveRR,
        canRejectRR,
        user?.roles,
        isManager,
    ])
    return {}
}
