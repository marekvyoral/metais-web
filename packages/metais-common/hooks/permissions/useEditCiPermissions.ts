import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { useGetRoleParticipant, useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Gen_Profil } from '@isdd/metais-common/api/constants'
import { useGetRightsForPO, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CI_ITEM_QUERY_KEY, INVALIDATED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useCanCreateGraph } from '@isdd/metais-common/hooks/useCanCreateGraph'
import { getUniqueRules } from '@isdd/metais-common/permissions/helpers'

export const useEditCiPermissions = (entityName: string, entityId: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user, token },
    } = useAuth()
    const identityUuid = user?.uuid
    const isLoggedIn = !!identityUuid

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
                enabled: !ciLoading && !roleParticipantLoading && !ciError && !roleParticipantError && token !== null && isLoggedIn,
            },
        },
    )

    const { data: isOwnerByGid } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !ciLoading && token !== null && isLoggedIn } },
    )

    const { data: canCreateGraph } = useCanCreateGraph()

    useEffect(() => {
        const { can, rules: newRules } = new AbilityBuilder(createMongoAbility)
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

        const existingRules = abilityContext.rules
        const updatedRules = getUniqueRules(newRules, existingRules)

        const mergedRules = [...existingRules, ...updatedRules]
        abilityContext.update(mergedRules)
    }, [rightsData, abilityContext, ciTypeData, ciData, canCreateGraph, user?.roles, isOwnerByGid?.isOwner])
    return {}
}
