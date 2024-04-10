import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'
import { Actions } from './useUserAbility'

import { useGetRoleParticipant, useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME, Gen_Profil } from '@isdd/metais-common/api/constants'
import { useGetRightsForPO, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { CI_ITEM_QUERY_KEY, INVALIDATED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { getUniqueRules } from '@isdd/metais-common/permissions/helpers'
import { useGetMeta1 } from '@isdd/metais-common/api/generated/dms-swagger'
import { useIntegrationLinkConsumingAndProvidingProject } from '@isdd/metais-common/hooks/useIntegrationLink'
import { isOwnershipOnPoSide } from '@isdd/metais-common/utils/utils'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

export enum IntegrationLinkActions {
    APPROVE = 'APPROVE',
    SIGN = 'SIGN',
    REJECT = 'REJECT',
    REVERT_MANUAL_SIGN = 'REVERT_MANUAL_SIGN',
    MANUALLY_SIGN = 'MANUALLY_SIGN',
    EDIT_HARMONOGRAM_PLANNED_DATE = 'EDIT_HARMONOGRAM_PLANNED_DATE',
    EDIT_HARMONOGRAM_REAL_DATE = 'EDIT_HARMONOGRAM_REAL_DATE',
}

export enum DIZ_STATE {
    DRAFT = 'c_stav_diz.1',
    CONS_APPROVED = 'c_stav_diz.2',
    PROV_APPROVED = 'c_stav_diz.3',
    APPROVED = 'c_stav_diz.4',
    CONS_SIGNED = 'c_stav_diz.5',
    PROV_SIGNED = 'c_stav_diz.6',
    SIGNED = 'c_stav_diz.7',
    MANUALLY_SIGNED = 'c_stav_diz.8',
}

export const useEditIntegrationPermissions = (entityName: string, entityId: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user, token },
    } = useAuth()
    const identityUuid = user?.uuid
    const isLoggedIn = !!identityUuid

    const { data: ciTypeData, isLoading: ciTypeLoading, isError: ciTypeError } = useGetCiTypeWrapper(entityName ?? '')
    const {
        providingPOData,
        consumingPOData,
        isError: isIntegrationError,
        isLoading: isIntegrationLoading,
    } = useIntegrationLinkConsumingAndProvidingProject(entityId)
    const {
        data: ciData,
        isLoading: ciLoading,
        isError: ciError,
    } = useReadConfigurationItem(entityId ?? '', {
        query: { queryKey: [CI_ITEM_QUERY_KEY, entityId] },
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
        fetchStatus: rightsDataFetchStatus,
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
        isError: isOwnerByGidError,
        isLoading: isOwnerByGidLoading,
        fetchStatus: ownerByGidFetchStatus,
    } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !ciLoading && token !== null && isLoggedIn } },
    )
    const { data: dmsFileMetaData } = useGetMeta1(entityId ?? '')

    const ciOwner = ciData?.metaAttributes?.owner
    const isOwnerOfCi = isOwnerByGid?.isOwner?.[0]?.owner
    const isInvalidated = ciData?.metaAttributes?.state === INVALIDATED
    const isConsumer = isOwnershipOnPoSide(ciOwner ?? '', consumingPOData?.uuid ?? '')
    const isProvider = isOwnershipOnPoSide(ciOwner ?? '', providingPOData?.uuid ?? '')
    const dizState = ciData?.attributes?.[ATTRIBUTE_NAME.Integracia_Profil_Integracia_stav_diz]
    const hasMetaData = !!dmsFileMetaData

    useEffect(() => {
        const { can, rules: newRules } = new AbilityBuilder(createMongoAbility)
        const myRoles = user?.roles ?? []

        // CAN EDIT ENTITY
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

        if (!isOwnerOfCi || isInvalidated) return
        switch (dizState) {
            case DIZ_STATE.DRAFT: {
                if (isConsumer || isProvider) {
                    can(Actions.EDIT, `ci.${ciData?.uuid}`)
                    can(Actions.CHANGE_VALIDITY, `ci.${ciData?.uuid}`)
                    can(Actions.CHANGE_OWNER, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_PLANNED_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.MANUALLY_SIGN, `ci.${ciData?.uuid}`)
                    if (hasMetaData) {
                        can(IntegrationLinkActions.APPROVE, `ci.${ciData?.uuid}`)
                    }
                }
                if (isConsumer) {
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_REAL_DATE, `ci.${ciData?.uuid}`)
                }

                break
            }
            case DIZ_STATE.CONS_APPROVED: {
                if (isConsumer) {
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_PLANNED_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_REAL_DATE, `ci.${ciData?.uuid}`)
                }
                if (isProvider && hasMetaData) {
                    can(IntegrationLinkActions.APPROVE, `ci.${ciData?.uuid}`)
                }
                if (isProvider) {
                    can(IntegrationLinkActions.REJECT, `ci.${ciData?.uuid}`)
                }

                break
            }
            case DIZ_STATE.PROV_APPROVED: {
                if (isConsumer) {
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_PLANNED_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_REAL_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.REJECT, `ci.${ciData?.uuid}`)
                }
                if (isConsumer && hasMetaData) {
                    can(IntegrationLinkActions.APPROVE, `ci.${ciData?.uuid}`)
                }

                break
            }
            case DIZ_STATE.APPROVED: {
                if (isConsumer || isProvider) {
                    can(IntegrationLinkActions.MANUALLY_SIGN, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.REJECT, `ci.${ciData?.uuid}`)

                    if (hasMetaData) {
                        can(IntegrationLinkActions.SIGN, `ci.${ciData?.uuid}`)
                    }
                }
                if (isConsumer) {
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_PLANNED_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_REAL_DATE, `ci.${ciData?.uuid}`)
                }

                break
            }
            case DIZ_STATE.CONS_SIGNED: {
                if (isConsumer) {
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_PLANNED_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_REAL_DATE, `ci.${ciData?.uuid}`)
                }
                if (isProvider) {
                    if (hasMetaData) {
                        can(IntegrationLinkActions.SIGN, `ci.${ciData?.uuid}`)
                    }
                    can(IntegrationLinkActions.REJECT, `ci.${ciData?.uuid}`)
                }

                break
            }
            case DIZ_STATE.PROV_SIGNED: {
                if (isConsumer) {
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_PLANNED_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_REAL_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.REJECT, `ci.${ciData?.uuid}`)
                    if (hasMetaData) {
                        can(IntegrationLinkActions.SIGN, `ci.${ciData?.uuid}`)
                    }
                }

                break
            }
            case DIZ_STATE.SIGNED: {
                if (isConsumer || isProvider) {
                    can(Actions.CHANGE_VALIDITY, `ci.${ciData?.uuid}`)
                    can(Actions.CHANGE_OWNER, `ci.${ciData?.uuid}`)
                }
                if (isConsumer) {
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_PLANNED_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_REAL_DATE, `ci.${ciData?.uuid}`)
                }

                break
            }
            case DIZ_STATE.MANUALLY_SIGNED: {
                if (isConsumer) {
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_PLANNED_DATE, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.EDIT_HARMONOGRAM_REAL_DATE, `ci.${ciData?.uuid}`)
                }
                if (isConsumer || isProvider) {
                    can(Actions.CHANGE_VALIDITY, `ci.${ciData?.uuid}`)
                    can(Actions.CHANGE_OWNER, `ci.${ciData?.uuid}`)
                    can(IntegrationLinkActions.REVERT_MANUAL_SIGN, `ci.${ciData?.uuid}`)
                }
            }
        }

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
        dizState,
        hasMetaData,
        isConsumer,
        isProvider,
    ])

    const isLoading =
        ciTypeLoading ||
        ciLoading ||
        (roleParticipantLoading && roleParticipantFetchStatus != 'idle') ||
        (isOwnerByGidLoading && ownerByGidFetchStatus != 'idle') ||
        (isRightsDataLoading && rightsDataFetchStatus != 'idle') ||
        isIntegrationLoading
    const isError = ciTypeError || ciError || roleParticipantError || isRightsDataError || isOwnerByGidError || isIntegrationError

    return {
        isLoading,
        isError,
    }
}
