import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { useGetRoleParticipant, useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Gen_Profil } from '@isdd/metais-common/api/constants'
import { useGetRightsForPO, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { fetchCanCreateGraph } from '@isdd/metais-common/api/fetchCanCreateGraph'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CAN_CREATE_GRAPH_QUERY_KEY, CI_ITEM_QUERY_KEY, INVALIDATED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useEditCiPermissions = (entityName: string, entityId: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: {
            userInfo: user,
            userContext: { token },
        },
    } = useAuth()
    const identityUuid = user?.uuid
    const { data: ciTypeData, isLoading: ciTypeLoading } = useGetCiType(entityName ?? '')

    const {
        data: ciData,
        isLoading: ciLoading,
        isError: ciError,
    } = useReadConfigurationItem(entityId ?? '', {
        query: { enabled: !ciTypeLoading, queryKey: [CI_ITEM_QUERY_KEY, entityId] },
    })

    const {
        data: roleParticipantData,
        isLoading: roleParticipantLoading,
        isError: roleParticipantError,
    } = useGetRoleParticipant(ciData?.metaAttributes?.owner ?? '', {
        query: { enabled: !ciLoading && !ciError },
    })

    const { data: rightsData } = useGetRightsForPO(
        {
            identityUuid,
            cmdbId: roleParticipantData?.owner,
        },
        {
            query: {
                enabled: !ciLoading && !roleParticipantLoading && !ciError && !roleParticipantError && token !== null,
            },
        },
    )

    const { data: isOwnerByGid } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !ciLoading && token !== null } },
    )

    const { data: canCreateGraph } = useQuery({
        queryKey: [CAN_CREATE_GRAPH_QUERY_KEY, user?.uuid],
        queryFn: () => fetchCanCreateGraph(token ?? ''),
    })

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const myRoles = user?.roles ?? []
        const isInvalidated = ciData?.metaAttributes?.state === INVALIDATED

        // CAN EDIT ENTITY
        const canEditCi = rightsData?.find((val) => myRoles?.indexOf(val?.roleName ?? '') > -1)
        const allProfileAttributes = ciTypeData?.attributeProfiles

        // CAN GENERIC ATT PROFILE
        const canEditGenAttrProfile = ciTypeData?.roleList?.find((role) => myRoles?.indexOf(role) > -1)
        if (canEditGenAttrProfile && !isInvalidated) can(Actions.EDIT, `ci.${ciData?.uuid}.attributeProfile.${Gen_Profil}`)

        // CHECK ALL ATTRIBUTES PROFILES
        allProfileAttributes?.map((profileAttr) => {
            const attrRoles = profileAttr?.roleList
            const canEditAttrProfileWithTechnicalName = attrRoles?.find((role) => myRoles?.indexOf(role) > -1)
            if (canEditAttrProfileWithTechnicalName && !isInvalidated)
                can(Actions.EDIT, `ci.${ciData?.uuid}.attributeProfile.${profileAttr?.technicalName}`)
        })

        const isOwnerOfCi = isOwnerByGid?.isOwner?.[0]?.owner
        if (isOwnerOfCi && !isInvalidated) can(Actions.CHANGE_OWNER, `ci.${ciData?.uuid}`)

        if (!!canEditCi && !isInvalidated) can(Actions.EDIT, `ci.${ciData?.uuid}`)

        //CAN CREATE RELATION
        if (canCreateGraph && !isInvalidated) can(Actions.CREATE, `ci.create.newRelation`)

        abilityContext.update(rules)
    }, [rightsData, abilityContext, ciTypeData, isOwnerByGid, ciData, canCreateGraph, user?.roles])
    return {}
}
