import { ConfigurationItemUi, HierarchyRightsResultUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

import { SelectFilterOrganizationHierarchyOptionType } from './components/SelectFilterOrganizationHierarchy/SelectFilterOrganizationHierarchy'

export function extractOrganizationNamesFromCi(ciItems?: ConfigurationItemUi[]): string[] | undefined {
    return ciItems?.map((item) => item.attributes?.Gen_Profil_nazov).filter((item): item is string => !!item)
}

export function mapHierarchyRightsToOptions(data: HierarchyRightsResultUi): SelectFilterOrganizationHierarchyOptionType[] {
    return (
        data.rights
            ?.map(({ poUUID, poName, address }) => ({
                poUUID: poUUID ?? '',
                poName: poName ?? '',
                address: address ?? {},
            }))
            .filter((item) => !!item.poUUID) ?? []
    )
}
