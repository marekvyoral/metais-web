import { TFunction } from 'i18next'

import { Attribute, AttributeConstraintEnum, ConfigurationItemUi, EnumType } from '@isdd/metais-common/api'

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
    ciItemData: ConfigurationItemUi | undefined,
    constraintsData: (EnumType | undefined)[],
    t: TFunction<'translation', undefined, 'translation'>,
    unitsData: EnumType | undefined,
    withDescription?: boolean,
) => {
    const rowValue = ciItemData?.attributes?.[attribute?.technicalName ?? attribute?.name ?? '']
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
                default: {
                    return formattedRowValue
                }
            }
        }) ?? []
    )?.join(',')
}