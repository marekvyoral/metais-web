import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'
import { useCommonPermissionData } from './useCommonPermissionData'

import { Gen_Profil } from '@isdd/metais-common/api/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { getUniqueRules } from '@isdd/metais-common/permissions/helpers'

export const useHistoryCiPermissions = (entityName: string, entityId: string) => {
    const {
        state: { user },
    } = useAuth()
    const abilityContext = useAbilityContext()
    const { isError, isLoading, isOwnerByGid, ciData, ciTypeData, rightsData } = useCommonPermissionData({
        entityName,
        entityId,
    })

    useEffect(() => {
        const { can, rules: newRules } = new AbilityBuilder(createMongoAbility)
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

        //way how to update rules without scrapping existing ones
        const existingRules = abilityContext.rules
        const updatedRules = getUniqueRules(newRules, existingRules)

        const mergedRules = [...existingRules, ...updatedRules]
        abilityContext.update(mergedRules)
    }, [rightsData, abilityContext, ciTypeData, isOwnerByGid, ciData, user?.roles])

    return { isLoading, isError }
}
