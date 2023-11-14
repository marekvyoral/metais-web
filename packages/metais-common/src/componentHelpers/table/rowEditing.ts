import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const isRowSelected = (rowIndex: number, selectedRows: Array<number>) => selectedRows.indexOf(rowIndex) !== -1

export const filterSelectedRowsFromApi = (attributesOverridesData?: Attribute[], attributes?: Attribute[]) => {
    const allTechnicalNames = attributes?.map((attr) => attr?.technicalName)
    const selectedFromApi =
        attributesOverridesData?.map((attr) => (allTechnicalNames ?? [])?.indexOf(attr?.technicalName)).filter((v) => v !== undefined && v !== -1) ??
        []
    return selectedFromApi
}
