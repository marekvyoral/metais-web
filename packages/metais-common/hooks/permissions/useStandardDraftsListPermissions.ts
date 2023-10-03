import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { MembershipData, useFindMembershipData } from '@isdd/metais-common/api/generated/iam-swagger'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import { CONFLUENCE, GROUP_ROLES, KSISVS_ROLES, REFID_URI_SZ, ROLES_CAN_CHANGE_STD_DRAFTS } from '@isdd/metais-common/constants'
import { ApiLink, ApiStandardRequestPreviewRequestChannel } from '@/api/generated/standards-swagger'

interface IUseStandardDraftsListPermissions {
    data: {
        state: StandardDraftsDraftStates
        groupId: string
        links: ApiLink[] | undefined
        requestChannel: ApiStandardRequestPreviewRequestChannel | undefined
    }
}

export const useStandardDraftsListPermissions = ({ data: { state, groupId, links, requestChannel } }: IUseStandardDraftsListPermissions) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()
    const identityUuid = user?.uuid
    const { data: membershipData } = useFindMembershipData(identityUuid ?? '')

    const hasRole = (myRoles: string[], rolesOfEntity: string[]) => {
        return myRoles?.some((role: string) => rolesOfEntity?.indexOf(role) > -1)
    }

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const myRoles = user?.roles ?? []
        const userGroupData = membershipData?.membershipData?.find((item: MembershipData) => item.groupUuid == groupId)
        const isGroupMaster = myRoles?.includes(KSISVS_ROLES.STD_KSPRE) || userGroupData?.roleName === GROUP_ROLES.STD_PSPRE
        const isGroupSubMaster = myRoles?.includes(KSISVS_ROLES.STD_KSPODP) || userGroupData?.roleName === GROUP_ROLES.STD_PSPODP
        const isKoordinator = membershipData?.roles?.includes(KSISVS_ROLES.STD_KOORDINATOR_AGENDY)

        const canEdit = (state === StandardDraftsDraftStates.ASSIGNED && (isGroupMaster || isGroupSubMaster)) || isKoordinator
        const canChangeNewStdDraft =
            (state === StandardDraftsDraftStates.ASSIGNED || state === StandardDraftsDraftStates.REQUESTED) &&
            hasRole(myRoles, ROLES_CAN_CHANGE_STD_DRAFTS)
        const canRejectNewStdDraft = state === StandardDraftsDraftStates.REJECTED && hasRole(myRoles, ROLES_CAN_CHANGE_STD_DRAFTS)
        const canManageRIReq = state === StandardDraftsDraftStates.ASSIGNED && hasRole(myRoles, [REFID_URI_SZ])
        const canCreateConfluenceDoc = canEdit
        const canRejectAssignedStdDraft = canEdit

        const hasConfluenceDoc = links?.some((link) => link?.type === CONFLUENCE)

        if (canEdit) can(Actions.EDIT, `DraftsList`)
        if (canEdit || canChangeNewStdDraft || canRejectNewStdDraft || canManageRIReq) can(Actions.CHANGE_STATES, 'DraftsList')
        if (canCreateConfluenceDoc && !hasConfluenceDoc) can(Actions.CREATE, 'DraftsList.confluenceDocs')
        if (
            (canEdit || (canManageRIReq && requestChannel === ApiStandardRequestPreviewRequestChannel.RI)) &&
            state !== StandardDraftsDraftStates.ACCEPTED
        )
            can(Actions.CREATE, 'DraftsList.ACCEPTED')

        if (canRejectNewStdDraft || (canManageRIReq && requestChannel == ApiStandardRequestPreviewRequestChannel.RI) || canRejectAssignedStdDraft)
            can(Actions.CREATE, 'DraftsList.REJECTED')
        if (canChangeNewStdDraft) can(Actions.CREATE, 'DraftsList.ASSIGNED')
        can(Actions.CREATE, 'DraftsList')
        abilityContext.update(rules)
    }, [abilityContext, membershipData, groupId, state, user?.roles, links, requestChannel])
    return {}
}
