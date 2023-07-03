import { TFunction } from 'i18next'
import {
    Attribute,
    CiType,
    ConfigurationItemSetUi,
    ConfigurationItemUi,
    ConfigurationItemUiAttributes,
    EnumType,
    FavoriteCiType,
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
    constraintsData?: (EnumType | undefined)[],
) => {
    return (tableData?.configurationItemSet?.map((confItem: ConfigurationItemUi) => {
        const newAttributes: { [attributeName: string]: string } = {}
        Object.keys(confItem?.attributes ?? {})?.map((attributeName: string) => {
            const foundAttrWithTypes = reducedAttributes[attributeName]
            const newRowValue = pairEnumsToEnumValues(foundAttrWithTypes, confItem, constraintsData ?? [], t, false)
            newAttributes[attributeName] = newRowValue
        })

        return { ...confItem, attributes: newAttributes }
    }) ?? []) as ColumnsOutputDefinition[]
}

export const sortAndMergeCiColumns = (columnsList: FavoriteCiType) => {
    const columnsAttributes = columnsList?.attributes ?? []
    const columnsMetaAttributes = columnsList?.metaAttributes ?? []

    const mergedCiColumns = [...columnsAttributes, ...columnsMetaAttributes]
    mergedCiColumns?.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    return mergedCiColumns
}
