import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { Gen_Profil, useGetCiType, useGetRoleParticipant, useReadConfigurationItem } from '@isdd/metais-common/api'
import { useGetRightsForPO, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'

export const useHistoryCiPermissions = (entityName: string, entityId: string) => {
    const abilityContext = useAbilityContext()
    const auth = useAuth()
    const identityUuid = auth.state.user?.uuid
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

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const myRoles = auth?.state?.user?.roles ?? []
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
    }, [rightsData, auth, abilityContext, ciTypeData, isOwnerByGid, ciData])
    return {}
}
