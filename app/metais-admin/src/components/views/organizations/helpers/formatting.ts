import {
    ConfigurationItemSetUi,
    ConfigurationItemUi,
    ConfigurationItemUiAttributes,
    PoWithHierarchyUi,
    TOP_LEVEL_PO_ICO,
} from '@isdd/metais-common/api'
import { PoRelationshipIntegrityConstraints, RoleOrgGroup } from '@isdd/metais-common/api/generated/iam-swagger'
import { TFunction } from 'i18next'
import { FieldValues } from 'react-hook-form'

import { ConfItemWithBlockedAndMessage } from '@/components/containers/organizations/OrganizationsAssignedContainer'

export const removeEmptyAttributes = (formValues: FieldValues): ConfigurationItemUiAttributes[] => {
    return Object.keys(formValues)
        ?.map((key) => ({ name: key, value: formValues[key] }))
        ?.filter((val) => val?.value !== '')
}

export const createNewPOElement = (
    relId: string,
    poID: string,
    newGroup: RoleOrgGroup,
    sanitizedAttributes: ConfigurationItemUiAttributes[],
): PoWithHierarchyUi => {
    return {
        po: { type: 'PO', owner: newGroup?.gid, uuid: poID, attributes: sanitizedAttributes },
        hierarchy: {
            type: 'PO_je_podriadenou_PO',
            uuid: relId,
            startUuid: poID,
            endUuid: newGroup?.orgId,
            owner: newGroup?.gid,
            attributes: [],
        },
    }
}

export const getNameFromPo = (ci: ConfigurationItemUi | undefined) => {
    return ci?.attributes?.['Gen_Profil_nazov']
}

export const getIcoFromPO = (ci: ConfigurationItemUi | undefined) => {
    return ci?.attributes?.['EA_Profil_PO_ico']
}

export const isCiAlreadyAssinged = (ciUuid?: string, ciData?: ConfigurationItemUi[]) => {
    return ciData?.some((ci) => ci?.uuid === ciUuid)
}

export const calcBlockedOrganizations = (
    configurationItemSet?: ConfigurationItemSetUi,
    integrityConstraints?: PoRelationshipIntegrityConstraints[],
    onlyFreePO?: boolean,
    entityId?: string,
    icoOfDetailOrg?: string,
    t?: TFunction<'translation', undefined, 'translation'>,
): ConfItemWithBlockedAndMessage[] => {
    return (
        configurationItemSet?.configurationItemSet?.map((confItem) => {
            if (!integrityConstraints || !onlyFreePO)
                return {
                    ...confItem,
                    blocked: false,
                    blockMessage: undefined,
                }

            if (confItem?.uuid === entityId)
                return {
                    ...confItem,
                    blocked: true,
                    blockMessage: t?.('organizations.assigned.warningInfo'),
                }
            else if (icoOfDetailOrg === TOP_LEVEL_PO_ICO) {
                return {
                    ...confItem,
                    blocked: true,
                    blockMessage: t?.('organizations.assigned.topLevelOrg'),
                }
            }

            const foundInIntegrityData = integrityConstraints?.find(
                (intData) => intData?.subCmdbId === confItem?.uuid && (intData?.cycleInHierarchy || intData?.assignedInHierarchy),
            )

            if (foundInIntegrityData?.cycleInHierarchy) {
                return {
                    ...confItem,
                    blocked: true,
                    blockMessage: t?.('organizations.assigned.isCycleInHierarchy'),
                }
            } else if (foundInIntegrityData?.assignedInHierarchy) {
                return {
                    ...confItem,
                    blocked: true,
                    blockMessage: t?.('organizations.assigned.isAssigned'),
                }
            }

            return {
                ...confItem,
                blocked: false,
                blockMessage: undefined,
            }
        }) ?? []
    )
}
