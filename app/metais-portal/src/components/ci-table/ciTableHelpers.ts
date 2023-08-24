import { TFunction } from 'i18next'
import {
    ATTRIBUTE_NAME,
    Attribute,
    CiType,
    ConfigurationItemSetUi,
    ConfigurationItemUi,
    ConfigurationItemUiAttributes,
    EnumType,
    FavoriteCiType,
    RoleParticipantUI,
} from '@isdd/metais-common/api'

import { pairEnumsToEnumValues } from '@/componentHelpers'

interface ReducedAttributes {
    [technicalName: string]: Attribute
}

export interface ColumnsOutputDefinition {
    attributes?: ConfigurationItemUiAttributes
    metaAttributes?: {
        [key: string]: string
    }
    type?: string
    uuid?: string
    checked?: boolean
}

export const reduceAttributesByTechnicalName = (entityStructure: CiType | undefined) => {
    let allAttributes = [...(entityStructure?.attributes ?? [])]
    entityStructure?.attributeProfiles?.map((attribute) => {
        allAttributes = [...allAttributes, ...(attribute?.attributes ?? [])]
    })

    const groupBySlashCount = allAttributes.reduce((outputObject: ReducedAttributes, attribute) => {
        outputObject[attribute?.technicalName ?? ''] = attribute
        return outputObject
    }, {})

    return groupBySlashCount
}

export const mapTableData = (
    tableData: ConfigurationItemSetUi | undefined | void,
    reducedAttributes: ReducedAttributes,
    t: TFunction<'translation', undefined, 'translation'>,
    unitsData: EnumType | undefined,
    constraintsData?: (EnumType | undefined)[],
) => {
    return (tableData?.configurationItemSet?.map((confItem: ConfigurationItemUi) => {
        const newAttributes: { [attributeName: string]: string } = {}
        Object.keys(confItem?.attributes ?? {})?.map((attributeName: string) => {
            const foundAttrWithTypes = reducedAttributes[attributeName]
            const newRowValue = pairEnumsToEnumValues(foundAttrWithTypes, confItem, constraintsData ?? [], t, unitsData, false)
            newAttributes[attributeName] = newRowValue
        })

        return { ...confItem, attributes: newAttributes }
    }) ?? []) as ColumnsOutputDefinition[]
}

export const sortAndMergeCiColumns = (columnsList: FavoriteCiType) => {
    const columnsAttributes = columnsList?.attributes ?? []
    const columnsMetaAttributes = columnsList?.metaAttributes ?? []

    const mergedCiColumns = [...columnsAttributes, ...columnsMetaAttributes]
    //The column with the specified name('Gen_Profil_nazov') is always placed first, while the other columns are sorted according to order property
    mergedCiColumns?.sort((a, b) => {
        if (a.name === ATTRIBUTE_NAME.Gen_Profil_nazov) {
            return -1
        }
        if (b.name === ATTRIBUTE_NAME.Gen_Profil_nazov) {
            return 1
        }
        return (a?.order ?? 0) - (b?.order ?? 0)
    })

    return mergedCiColumns
}

export const reduceTableDataToObject = <T extends { uuid?: string }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.uuid) {
            result[item.uuid] = item
        }
        return result
    }, {})
}

export const getOwnerInformation = (ownerGid: string, ownerList: RoleParticipantUI[] | undefined) => {
    const foundOwner = ownerList?.find((item) => item.gid === ownerGid)
    return foundOwner
}
