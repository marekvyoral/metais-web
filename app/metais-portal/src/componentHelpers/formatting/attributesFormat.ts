import { TFunction } from 'i18next'
import { Attribute, AttributeConstraintEnum, EnumType, ConfigurationItemUi } from '@isdd/metais-common/api'

const formatRowValueByRowType = (attribute: Attribute | undefined, rowValue: string, t: TFunction<'translation', undefined, 'translation'>) => {
    switch (attribute?.type) {
        case 'BOOLEAN':
            return rowValue ? t('radioButton.yes') : t('radioButton.no')
        case 'DATE':
            if (rowValue) return new Date(rowValue).toDateString()
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
    withDescription?: boolean,
) => {
    const rowValue = ciItemData?.attributes?.[attribute?.technicalName ?? attribute?.name ?? '']
    const formattedRowValue = formatRowValueByRowType(attribute, rowValue, t)
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
