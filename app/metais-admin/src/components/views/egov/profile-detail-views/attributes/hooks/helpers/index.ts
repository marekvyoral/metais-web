export const isSelectedTypeNumber = (newSelectedType?: string) =>
    newSelectedType === 'INTEGER' || newSelectedType === 'LONG' || newSelectedType === 'DOUBLE'

export const getTypeForDefaultValue = (newSelectedType?: string) => {
    if (isSelectedTypeNumber(newSelectedType)) return 'number'
    else if (newSelectedType === 'DATE') return 'date'
}
