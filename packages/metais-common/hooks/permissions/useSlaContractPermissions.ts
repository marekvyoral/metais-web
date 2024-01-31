import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { useGetRoleParticipant, useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME, Gen_Profil } from '@isdd/metais-common/api/constants'
import { useGetRightsForPO, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CI_ITEM_QUERY_KEY, INVALIDATED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { getUniqueRules } from '@isdd/metais-common/permissions/helpers'
import { isOwnershipOnPoSide } from '@isdd/metais-common/utils/utils'
import { useSlaContractDetail } from '@isdd/metais-common/hooks/useSlaContractDetail.hook'
import { useGetMeta } from '@isdd/metais-common/api/generated/dms-swagger'

export enum SlaAction {
    CONS_APPROVE = 'CONS_APPROVE',
    PROV_APPROVE = 'PROV_APPROVE',
    CONS_SIGN = 'CONS_SIGN',
    PROV_SIGN = 'PROV_SIGN',
    REJECT = 'REJECT',
    REVERT_MANUAL_SIGN = 'REVERT_MANUAL_SIGN',
    MANUALLY_SIGN = 'MANUALLY_SIGN',
}

export enum CONTRACT_PHASE {
    DRAFT = 'c_faza_kontraktu.1',
    CONS_APPROVED = 'c_faza_kontraktu.2',
    PROV_APPROVED = 'c_faza_kontraktu.3',
    APPROVED = 'c_faza_kontraktu.4',
    CONS_SIGNED = 'c_faza_kontraktu.5',
    PROV_SIGNED = 'c_faza_kontraktu.6',
    SIGNED = 'c_faza_kontraktu.7',
    MANUALLY_SIGNED = 'c_faza_kontraktu.8',
}

export const useSlaContractPermissions = (entityName: string, entityId: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user, token },
    } = useAuth()
    const identityUuid = user?.uuid
    const isLoggedIn = !!identityUuid

    const { data: ciTypeData, isLoading: ciTypeLoading, isError: ciTypeError } = useGetCiType(entityName ?? '')
    const { slaContractData, ciItemData, isError: isSlaContractError, isLoading: isSlaContractLoading } = useSlaContractDetail(entityId ?? '')
    const { data: dmsFileMetaData, isInitialLoading: isDmsLoading } = useGetMeta(entityId ?? '')

    const {
        data: ciData,
        isLoading: ciLoading,
        isError: ciError,
        fetchStatus: ciDataFetchStatus,
    } = useReadConfigurationItem(entityId ?? '', {
        query: { enabled: !ciTypeLoading, queryKey: [CI_ITEM_QUERY_KEY, entityId] },
    })

    const {
        data: roleParticipantData,
        isLoading: roleParticipantLoading,
        isError: roleParticipantError,
        fetchStatus: roleParticipantFetchStatus,
    } = useGetRoleParticipant(ciData?.metaAttributes?.owner ?? '', {
        query: { enabled: !ciLoading && !ciError },
    })

    const {
        data: rightsData,
        isError: isRightsDataError,
        isLoading: isRightsDataLoading,
        fetchStatus: rightsFetchStatus,
    } = useGetRightsForPO(
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

    const {
        data: isOwnerByGid,
        isError: isOwnerError,
        isLoading: isOwnerLoading,
        fetchStatus: ownerFetchStatus,
    } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !ciLoading && token !== null && isLoggedIn } },
    )

    const isLoading =
        (isOwnerLoading && ownerFetchStatus != 'idle') ||
        (isRightsDataLoading && rightsFetchStatus != 'idle') ||
        (roleParticipantLoading && roleParticipantFetchStatus != 'idle') ||
        (ciLoading && ciDataFetchStatus != 'idle') ||
        ciTypeLoading ||
        isSlaContractLoading ||
        isDmsLoading

    const isError = isOwnerError || isRightsDataError || roleParticipantError || ciError || ciTypeError || isSlaContractError

    const isOwnerOfCi = isOwnerByGid?.isOwner?.[0]?.owner
    const isInvalidated = ciData?.metaAttributes?.state === INVALIDATED

    //SLA ACTION permissions
    const contractPhase = ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_Kontrakt_faza]
    const slaOwner = slaContractData?.owner ?? ''
    const hasMetaData = !!dmsFileMetaData
    const isConsumer = isOwnershipOnPoSide(slaOwner, slaContractData?.consumerIsvsMainPerson?.uuid ?? '')
    const isProvider = isOwnershipOnPoSide(slaOwner, slaContractData?.providerIsvsMainPerson?.uuid ?? '')
    const isDraft = contractPhase == CONTRACT_PHASE.DRAFT

    const canManuallySign =
        contractPhase == CONTRACT_PHASE.DRAFT ||
        contractPhase == CONTRACT_PHASE.CONS_APPROVED ||
        contractPhase == CONTRACT_PHASE.PROV_APPROVED ||
        contractPhase == CONTRACT_PHASE.APPROVED
    const canRevertManualSign = contractPhase == CONTRACT_PHASE.MANUALLY_SIGNED
    const canConsApprove =
        (contractPhase == CONTRACT_PHASE.DRAFT && hasMetaData && isConsumer) || (contractPhase == CONTRACT_PHASE.PROV_APPROVED && isConsumer)
    const canProvApprove = contractPhase == CONTRACT_PHASE.CONS_APPROVED && isProvider
    const canConsSign = contractPhase == CONTRACT_PHASE.APPROVED && isConsumer
    const canProvSign = contractPhase == CONTRACT_PHASE.CONS_SIGNED && isProvider
    const canReject = canConsSign || canProvSign || canProvApprove

    useEffect(() => {
        if (isInvalidated) return

        const { can, rules: newRules } = new AbilityBuilder(createMongoAbility)
        const myRoles = user?.roles ?? []
        const hasSlaContractRoles = ciTypeData?.roleList?.find((role) => myRoles?.indexOf(role) > -1)
        const canEdit = isOwnerOfCi && hasSlaContractRoles

        // CAN EDIT ENTITY
        const allProfileAttributes = ciTypeData?.attributeProfiles

        // CAN GENERIC ATT PROFILE
        const canEditGenAttrProfile = hasSlaContractRoles
        if (canEditGenAttrProfile) can(Actions.EDIT, `ci.${ciData?.uuid}.attributeProfile.${Gen_Profil}`)

        // CHECK ALL ATTRIBUTES PROFILES
        allProfileAttributes?.map((profileAttr) => {
            const attrRoles = profileAttr?.roleList
            const canEditAttrProfileWithTechnicalName = attrRoles?.find((role) => myRoles?.indexOf(role) > -1)
            if (canEditAttrProfileWithTechnicalName) can(Actions.EDIT, `ci.${ciData?.uuid}.attributeProfile.${profileAttr?.technicalName}`)
        })

        if (canEdit && isDraft) {
            can(Actions.EDIT, `ci.${ciData?.uuid}`)
            can(Actions.CHANGE_OWNER, `ci.${ciData?.uuid}`)
        }

        if (canConsApprove && hasSlaContractRoles) can(SlaAction.CONS_APPROVE, `ci.${ciData?.uuid}`)
        if (canProvApprove && hasSlaContractRoles) can(SlaAction.PROV_APPROVE, `ci.${ciData?.uuid}`)
        if (canConsSign && hasSlaContractRoles) can(SlaAction.CONS_SIGN, `ci.${ciData?.uuid}`)
        if (canProvSign && hasSlaContractRoles) can(SlaAction.PROV_SIGN, `ci.${ciData?.uuid}`)
        if (canReject && hasSlaContractRoles) can(SlaAction.REJECT, `ci.${ciData?.uuid}`)
        if (canManuallySign && canEdit) can(SlaAction.MANUALLY_SIGN, `ci.${ciData?.uuid}`)
        if (canRevertManualSign && hasSlaContractRoles) can(SlaAction.REVERT_MANUAL_SIGN, `ci.${ciData?.uuid}`)

        const existingRules = abilityContext.rules
        const updatedRules = getUniqueRules(newRules, existingRules)

        const mergedRules = [...existingRules, ...updatedRules]
        abilityContext.update(mergedRules)
    }, [
        rightsData,
        abilityContext,
        ciTypeData,
        ciData,
        user?.roles,
        isOwnerByGid?.isOwner,
        isInvalidated,
        isOwnerOfCi,
        canConsApprove,
        canConsSign,
        canManuallySign,
        canProvApprove,
        canProvSign,
        canReject,
        canRevertManualSign,
        isDraft,
    ])

    return { isLoading, isError }
}
