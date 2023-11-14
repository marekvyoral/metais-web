import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { Gen_Profil } from '@isdd/metais-common/api/constants'
import { useGetRoleParticipant, useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetRightsForPO, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useHistoryCiPermissions = (entityName: string, entityId: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user, token },
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

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const myRoles = user?.roles ?? []
        // CAN EDIT ENTITY
        const canHistoryCi = rightsData?.find((val) => myRoles?.indexOf(val?.roleName ?? '') > -1)
        const allProfileAttributes = ciTypeData?.attributeProfiles

        // CAN GENERIC ATT PROFILE
        const canHisotryGenAttrProfile = ciTypeData?.roleList?.find((role) => myRoles?.indexOf(role) > -1)
        if (canHisotryGenAttrProfile) can(Actions.HISTORY, `ci.${ciData?.uuid}.attributeProfile.${Gen_Profil}`)

        // CHECK ALL ATTRIBUTES PROFILES
        allProfileAttributes?.map((profileAttr) => {
            const attrRoles = profileAttr?.roleList
            const canHistoryAttrProfileWithTechnicalName = attrRoles?.find((role) => myRoles?.indexOf(role) > -1)
            if (canHistoryAttrProfileWithTechnicalName) can(Actions.HISTORY, `ci.${ciData?.uuid}.attributeProfile.${profileAttr?.technicalName}`)
        })

        if (canHistoryCi) can(Actions.HISTORY, `ci.${ciData?.uuid}`)

        abilityContext.update(rules)
    }, [rightsData, abilityContext, ciTypeData, isOwnerByGid, ciData, user?.roles])
    return {}
}
