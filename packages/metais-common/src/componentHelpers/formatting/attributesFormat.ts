import { TFunction } from 'i18next'

import { MetainformationColumns } from '../ci/getCiDefaultMetaAttributes'

import { ATTRIBUTE_NAME, ConfigurationItemUi, EnumType } from '@isdd/metais-common/api'
import { ConfigurationItemUi as ConfigurationItemUiOriginal } from '@isdd/metais-common/api/generated/iam-swagger'
import { Attribute, AttributeConstraintEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'

const findUnitValue = (attribute: Attribute | undefined, unitsData: EnumType | undefined) => {
    const unit = unitsData?.enumItems?.find((item) => item.code === attribute?.units)?.value ?? ''
    if (unit.toLowerCase().includes('eur')) return 'Eur'
    return unit
}

const formatRowValueByRowType = (
    attribute: Attribute | undefined,
    rowValue: string,
    t: TFunction<'translation', undefined, 'translation'>,
    unitsData: EnumType | undefined,
) => {
    if (attribute?.units && attribute?.type && rowValue) {
        const unitValue = findUnitValue(attribute, unitsData)
        return t('currency', { val: rowValue, currency: unitValue })
    }
    switch (attribute?.type) {
        case 'BOOLEAN':
            return rowValue ? t('radioButton.yes') : t('radioButton.no')
        case 'DATE':
            if (rowValue) return t('dateTime', { date: rowValue })
            return rowValue
        default:
            return rowValue
    }
}

export const pairEnumsToEnumValues = (
    attribute: Attribute | undefined,
    ciItemData: ConfigurationItemUi | ConfigurationItemUiOriginal | undefined,
    constraintsData: (EnumType | undefined)[] | undefined,
    t: TFunction<'translation', undefined, 'translation'>,
    unitsData: EnumType | undefined,
    matchedAttributeNamesToCiItem: Record<string, ConfigurationItemUi> | undefined,
    withDescription?: boolean,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rowValue: any
    if (Array.isArray(ciItemData?.attributes)) {
        rowValue = ciItemData?.attributes?.find((i) => i.name === attribute?.technicalName || i.name === attribute?.name)?.value || ''
    } else {
        rowValue = ciItemData?.attributes?.[attribute?.technicalName ?? attribute?.name ?? '']
    }
    const formattedRowValue = formatRowValueByRowType(attribute, rowValue, t, unitsData)
    if (!attribute?.constraints || !attribute?.constraints?.length) return formattedRowValue
    return (
        attribute?.constraints?.map((constraint) => {
            switch (constraint?.type) {
                case 'enum': {
                    const recastConstraint = constraint as AttributeConstraintEnum
                    const foundEnumByCode = constraintsData?.find((cD) => cD?.code === recastConstraint?.enumCode)
                    const isRowValueArray = Array.isArray(rowValue)
                    const foundEnumItems = foundEnumByCode?.enumItems?.filter((enumItem) =>
                        isRowValueArray ? rowValue?.indexOf(enumItem?.code) !== -1 : enumItem?.code === rowValue,
                    )

                    if (withDescription)
                        return foundEnumItems?.map((enumItem) => {
                            if (enumItem?.description) return [enumItem.value, enumItem.description]
                            return [enumItem?.value]
                        })
                    return foundEnumItems?.flatMap((enumItem) => [enumItem.value])
                }
                case 'interval': {
                    return parseInt(formattedRowValue ?? 0) ?? 0
                }
                case 'ciType': {
                    return matchedAttributeNamesToCiItem?.[attribute.technicalName ?? '']?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? ''
                }
                default: {
                    return formattedRowValue
                }
            }
        }) ?? []
    )?.join(',')
}

export const distinctAttributesMetaAttributes = (
    attributes: Attribute[],
    metaAttributes: {
        name: string
        attributes: {
            name: string
            technicalName: MetainformationColumns
        }[]
    },
) => {
    return attributes?.filter((attr) => !metaAttributes?.attributes?.find((metaAttribute) => metaAttribute?.technicalName === attr?.technicalName))
}
