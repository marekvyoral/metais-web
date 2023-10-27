import {
    ATTRIBUTE_NAME,
    ConfigurationItemSetUi,
    ConfigurationItemUi,
    ConfigurationItemUiAttributes,
    EnumType,
    FavoriteCiType,
    RoleParticipantUI,
} from '@isdd/metais-common/api'
import { Attribute, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { MetainformationColumns } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { pairEnumsToEnumValues } from '@isdd/metais-common/index'
import { ColumnOrderState } from '@tanstack/react-table'
import { TFunction } from 'i18next'

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

export interface IStoreColumnSelection {
    attributes: {
        name: string
        order: number
    }[]
    metaAttributes: {
        name: string
        order: number
    }[]
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
    uuidsToMatchedCiItemsMap?: Record<string, Record<string, ConfigurationItemUi>> | undefined,
) => {
    return (tableData?.configurationItemSet?.map((confItem: ConfigurationItemUi) => {
        const newAttributes: { [attributeName: string]: string } = {}
        Object.keys(confItem?.attributes ?? {})?.map((attributeName: string) => {
            const foundAttrWithTypes = reducedAttributes[attributeName]
            const newRowValue = pairEnumsToEnumValues(
                foundAttrWithTypes,
                confItem,
                constraintsData ?? [],
                t,
                unitsData,
                uuidsToMatchedCiItemsMap?.[confItem.uuid ?? ''] ?? {},
                false,
            )
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

export const getOrderCiColumns = (columnsList: FavoriteCiType, orderList: ColumnOrderState): IStoreColumnSelection => {
    const columnsAttributes = columnsList?.attributes ?? []
    const columnsMetaAttributes = columnsList?.metaAttributes ?? []

    const attributes: { order: number; name: string }[] = columnsAttributes.map((attribute) => {
        const order = orderList.indexOf(attribute.name || '')
        return { name: attribute.name || '', order }
    })

    const metaAttributes: { order: number; name: string }[] = columnsMetaAttributes.map((attribute) => {
        const order = orderList.indexOf(attribute.name || '')
        return { name: attribute.name || '', order }
    })
    return { attributes, metaAttributes }
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

export const isMetaAttribute = (metaTechnicalName: string) => {
    return (
        metaTechnicalName === MetainformationColumns.OWNER ||
        metaTechnicalName === MetainformationColumns.STATE ||
        metaTechnicalName === MetainformationColumns.CREATED_AT ||
        metaTechnicalName === MetainformationColumns.LAST_MODIFIED_AT
    )
}
