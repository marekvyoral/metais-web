import {
    ConfigurationItemNeighbourSetUi,
    ConfigurationItemUi,
    ConfigurationItemUiAttributes,
    HierarchyRightsUi,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'

import { PublicAuthoritiesHierarchyItem } from './PublicAuthoritiesHierarchyContainer'

export const mapRightsToHierarchyItem = (rights?: HierarchyRightsUi[]): PublicAuthoritiesHierarchyItem => {
    const po = rights?.[0]
    const address = po?.address
    return {
        name: po?.poName ?? '',
        uuid: po?.poUUID ?? '',
        address: `${address?.street ?? ''} ${address?.number ? address?.number + ',' : ''} ${address?.zipCode ?? ''} ${address?.village ?? ''}`,
        children: [],
    }
}

const getAddressFromAttributes = (attributes?: ConfigurationItemUiAttributes): string => {
    const street = `${attributes?.find((attr: ConfigurationItemUiAttributes) => attr.name === ATTRIBUTE_NAME.EA_Profil_PO_ulica)?.value ?? ''}`
    const number = `${attributes?.find((attr: ConfigurationItemUiAttributes) => attr.name === ATTRIBUTE_NAME.EA_Profil_PO_cislo)?.value ?? ''}`
    const zipCode = `${attributes?.find((attr: ConfigurationItemUiAttributes) => attr.name === ATTRIBUTE_NAME.EA_Profil_PO_obec)?.value ?? ''}`
    const town = `${attributes?.find((attr: ConfigurationItemUiAttributes) => attr.name === ATTRIBUTE_NAME.EA_Profil_PO_psc)?.value ?? ''} `
    const comma = (street || number) && (zipCode || town) ? ',' : ''
    return `${street} ${number}${comma} ${zipCode} ${town}`
}

export const mapCiSetToHierarchyItems = (ciItems: ConfigurationItemUi[]): PublicAuthoritiesHierarchyItem[] => {
    return ciItems
        .map((ci) => {
            const name = ci.attributes
                ? ci.attributes.find((attr: ConfigurationItemUiAttributes) => attr.name === ATTRIBUTE_NAME.Gen_Profil_nazov).value
                : 'name'
            return {
                name: name ?? '',
                uuid: ci.uuid ?? '',
                address: getAddressFromAttributes(ci.attributes),
                children: [],
            }
        })
        .sort((a: PublicAuthoritiesHierarchyItem, b: PublicAuthoritiesHierarchyItem) => {
            if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1
            return 1
        })
}

export const arrayToTree = (flatItems: PublicAuthoritiesHierarchyItem[]): PublicAuthoritiesHierarchyItem[] => {
    while (flatItems.length !== 1) {
        let i = flatItems.length - 1
        const child = flatItems.pop()
        child && flatItems[i - 1].children?.push(child)
        i--
    }
    return flatItems
}

export const findItemInHierarchy = (entireObj: PublicAuthoritiesHierarchyItem[], keyToFind: string, valToFind: string) => {
    let foundObj: PublicAuthoritiesHierarchyItem = { name: '', uuid: '', address: '' }
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind) {
            foundObj = nestedValue
        }
        return nestedValue
    })
    return foundObj
}

export const setAreChildrenExpandable = (
    neighbours: { [key: string]: ConfigurationItemNeighbourSetUi },
    children: PublicAuthoritiesHierarchyItem[],
) => {
    for (const key in neighbours) {
        if (Object.hasOwn(neighbours, key)) {
            const rels = neighbours[key]
            if (rels.toCiSet && rels.toCiSet.length > 0) {
                children?.map((child) => {
                    return child.uuid === key ? (child.canExpand = true) : child
                })
            }
        }
    }
}
