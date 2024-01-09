import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const isRowSelected = (rowIndex: number | undefined, selectedRows: Array<number>) => (rowIndex ? selectedRows.indexOf(rowIndex) !== -1 : false)

export const isRowZeroIndexSelected = (rowIndex: number | undefined, selectedRows: Array<number>) =>
    typeof rowIndex === 'number' ? selectedRows.indexOf(rowIndex) !== -1 : false

export const filterSelectedRowsFromApi = (attributesOverridesData?: Attribute[], attributes?: Attribute[], indexModificator?: number) => {
    const allTechnicalNames = attributes?.map((attr) => attr?.technicalName)
    const selectedFromApi =
        attributesOverridesData
            ?.map((attr) => (allTechnicalNames ?? [])?.indexOf(attr?.technicalName))
            .filter((v) => v !== undefined && v !== -1)
            .map((v) => v + (indexModificator || 0)) ?? []
    return selectedFromApi
}
