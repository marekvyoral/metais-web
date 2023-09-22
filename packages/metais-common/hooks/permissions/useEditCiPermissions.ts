import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { Gen_Profil, useGetCiType, useGetRoleParticipant, useReadConfigurationItem } from '@isdd/metais-common/api'
import { useGetRightsForPO, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { fetchCanCreateGraph } from '@isdd/metais-common/api/fetchCanCreateGraph'
import { CAN_CREATE_GRAPH_QUERY_KEY } from '@isdd/metais-common/constants'

export const useEditCiPermissions = (entityName: string, entityId: string) => {
    const abilityContext = useAbilityContext()
    const auth = useAuth()
    const identityUuid = auth.state.user?.uuid
    const { data: ciTypeData, isLoading: ciTypeLoading } = useGetCiType(entityName ?? '')

    const {
        data: ciData,
        isLoading: ciLoading,
        isError: ciError,
    } = useReadConfigurationItem(entityId ?? '', {
        query: { enabled: !ciTypeLoading, queryKey: ['ciItemData', entityId] },
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
                enabled: !ciLoading && !roleParticipantLoading && !ciError && !roleParticipantError && auth?.state?.accessToken !== null,
            },
        },
    )

    const { data: isOwnerByGid } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: auth?.state?.user?.login,
        },
        { query: { enabled: !ciLoading && auth?.state?.accessToken !== null } },
    )

    const { data: canCreateGraph } = useQuery({
        queryKey: [CAN_CREATE_GRAPH_QUERY_KEY, auth.state.user?.uuid],
        queryFn: () => fetchCanCreateGraph(auth.state.accessToken ?? ''),
    })

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const myRoles = auth?.state?.user?.roles ?? []
        // CAN EDIT ENTITY
        const canEditCi = rightsData?.find((val) => myRoles?.indexOf(val?.roleName ?? '') > -1)
        const allProfileAttributes = ciTypeData?.attributeProfiles

        // CAN GENERIC ATT PROFILE
        const canEditGenAttrProfile = ciTypeData?.roleList?.find((role) => myRoles?.indexOf(role) > -1)
        if (canEditGenAttrProfile) can(Actions.EDIT, `ci.${ciData?.uuid}.attributeProfile.${Gen_Profil}`)

        // CHECK ALL ATTRIBUTES PROFILES
        allProfileAttributes?.map((profileAttr) => {
            const attrRoles = profileAttr?.roleList
            const canEditAttrProfileWithTechnicalName = attrRoles?.find((role) => myRoles?.indexOf(role) > -1)
            if (canEditAttrProfileWithTechnicalName) can(Actions.EDIT, `ci.${ciData?.uuid}.attributeProfile.${profileAttr?.technicalName}`)
        })

        const isOwnerOfCi = isOwnerByGid?.isOwner?.[0]?.owner
        if (isOwnerOfCi) can(Actions.CHANGE_OWNER, `ci.${ciData?.uuid}`)

        if (canEditCi) can(Actions.EDIT, `ci.${ciData?.uuid}`)

        //CAN CREATE RELATION
        if (canCreateGraph) can(Actions.CREATE, `ci.create.newRelation`)

        abilityContext.update(rules)
    }, [rightsData, auth, abilityContext, ciTypeData, isOwnerByGid, ciData, canCreateGraph])
    return {}
}
