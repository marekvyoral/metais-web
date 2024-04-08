import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'
import { useCommonPermissionData } from './useCommonPermissionData'

import { Gen_Profil } from '@isdd/metais-common/api/constants'
import { INVALIDATED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useCanCreateGraph } from '@isdd/metais-common/hooks/useCanCreateGraph'
import { getUniqueRules } from '@isdd/metais-common/permissions/helpers'

export const useEditCiPermissions = (entityName: string, entityId: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()
    const { isLoading, isError, isOwnerByGid, ciData, ciTypeData, rightsData } = useCommonPermissionData({
        entityId,
        entityName,
    })

    const { data: canCreateGraph } = useCanCreateGraph()

    useEffect(() => {
        const { can, rules: newRules } = new AbilityBuilder(createMongoAbility)
        const myRoles = user?.roles ?? []
        const isInvalidated = ciData?.metaAttributes?.state === INVALIDATED

        const isOwnerOfCi = isOwnerByGid?.isOwner?.[0]?.owner

        // CAN EDIT ENTITY
        const canEditCi = rightsData?.find((val) => ciTypeData?.roleList?.includes(val?.roleName ?? ''))
        const allProfileAttributes = ciTypeData?.attributeProfiles

        // CAN GENERIC ATT PROFILE
        //const canEditGenAttrProfile = ciTypeData?.roleList?.find((role) => myRoles?.indexOf(role) > -1)
        if ((canEditCi || isOwnerOfCi) && !isInvalidated) can(Actions.EDIT, `ci.${ciData?.uuid}.attributeProfile.${Gen_Profil}`)

        const canApprove = user?.roles.some((role: string) => role === 'KRIS_SCHVAL') ?? false
        if (canApprove) can(Actions.APPROVE_KRIS, `ci.${ciData?.uuid}`)

        const canSubscribe = user?.roles.some((role: string) => role === 'KRIS_PODPIS') ?? false
        if (canSubscribe) can(Actions.KRIS_SUBSCRIBE, `ci.${ciData?.uuid}`)

        const canSendToApprovement = user?.roles.some((role: string) => role === 'KRIS_TVORBA') ?? false
        if (canSendToApprovement) can(Actions.KRIS_SEND_APPROVING, `ci.${ciData?.uuid}`)

        // CHECK ALL ATTRIBUTES PROFILES
        allProfileAttributes?.map((profileAttr) => {
            const attrRoles = profileAttr?.roleList
            const canEditAttrProfileWithTechnicalName = attrRoles?.find((role) => myRoles?.indexOf(role) > -1)
            if (canEditAttrProfileWithTechnicalName && !isInvalidated)
                can(Actions.EDIT, `ci.${ciData?.uuid}.attributeProfile.${profileAttr?.technicalName}`)
        })

        if (isOwnerOfCi && !isInvalidated) can(Actions.CHANGE_OWNER, `ci.${ciData?.uuid}`)

        if (!!canEditCi && !isInvalidated) can(Actions.EDIT, `ci.${ciData?.uuid}`)

        //CAN CREATE RELATION
        if (canCreateGraph && !isInvalidated) can(Actions.CREATE, `ci.create.newRelation`)

        const existingRules = abilityContext.rules
        const updatedRules = getUniqueRules(newRules, existingRules)

        const mergedRules = [...existingRules, ...updatedRules]
        abilityContext.update(mergedRules)
    }, [rightsData, abilityContext, ciTypeData, ciData, canCreateGraph, user?.roles, isOwnerByGid?.isOwner])

    return { isLoading, isError }
}
