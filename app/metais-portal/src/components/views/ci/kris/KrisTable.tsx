import { Table, TextBody } from '@isdd/idsk-ui-kit'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { MetainformationColumns } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { IListData } from '@isdd/metais-common/types/list'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import { KRIScolumnsTechNames } from '@isdd/metais-common/constants'

import {
    ColumnsOutputDefinition,
    isMetaAttribute,
    mapTableData,
    reduceAttributesByTechnicalName,
    useGetColumnsFromApiCellContent,
} from '@/componentHelpers/ci/ciTableHelpers'

export interface IRowSelectionState {
    rowSelection: Record<string, ColumnsOutputDefinition>
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, ColumnsOutputDefinition>>>
}

interface ICiTable {
    data: IListData
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
    rowSelectionState?: IRowSelectionState
    uuidsToMatchedCiItemsMap?: Record<string, Record<string, ConfigurationItemUi>>
}

export const KrisTable: React.FC<ICiTable> = ({
    data,
    pagination,
    handleFilterChange,
    sort,
    isLoading,
    isError,
    uuidsToMatchedCiItemsMap,
    rowSelectionState,
}) => {
    const { t } = useTranslation()
    const { getColumnsFromApiCellContent } = useGetColumnsFromApiCellContent()

    const schemaAttributes = reduceAttributesByTechnicalName(data?.entityStructure)
    const tableData = mapTableData(
        data.tableData?.configurationItemSet,
        schemaAttributes,
        t,
        data.unitsData,
        data.constraintsData,
        uuidsToMatchedCiItemsMap,
    )

    const columns: Array<ColumnDef<ColumnsOutputDefinition>> = KRIScolumnsTechNames.map((technicalName, index) => {
        const isOwner = technicalName === MetainformationColumns.OWNER

        const attributeHeader = isMetaAttribute(technicalName) ? t(`ciType.meta.${technicalName}`) : schemaAttributes[technicalName]?.name

        return {
            accessorFn: (row: ColumnsOutputDefinition) => row?.attributes?.[technicalName] ?? row?.metaAttributes?.[technicalName],
            header: () => {
                if (isOwner) {
                    return <span>{t('KRIS.responsibleAuthority')}</span>
                }
                return <span>{attributeHeader ?? technicalName}</span>
            },
            id: technicalName ?? '',
            size: index === 0 ? 300 : 200,
            cell: (ctx: CellContext<ColumnsOutputDefinition, unknown>) => (
                <TextBody lang={setEnglishLangForAttr(technicalName ?? '')} size="S" className={'marginBottom0'}>
                    {getColumnsFromApiCellContent({ index, ctx, technicalName, schemaAttributes, data, rowSelectionState })}
                </TextBody>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ColumnsOutputDefinition, unknown>) =>
                    getColumnsFromApiCellContent({ index, ctx, technicalName, schemaAttributes, data, rowSelectionState }),
            },
            enableSorting: true,
        }
    })

    return (
        <>
            <Table
                columns={columns}
                data={tableData}
                rowHref={(row) => `./${row?.original?.uuid}`}
                onSortingChange={(newSort) => {
                    handleFilterChange({ sort: newSort })
                }}
                sort={sort}
                isLoading={isLoading}
                error={isError}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
