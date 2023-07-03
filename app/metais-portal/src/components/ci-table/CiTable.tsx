import React, { useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { CellContext, ColumnDef, Row } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table, TextBody } from '@isdd/idsk-ui-kit'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import classNames from 'classnames'

import { ColumnsOutputDefinition, mapTableData, reduceAttributesByTechnicalName, sortAndMergeCiColumns } from './ciTableHelpers'
import styles from './ciTable.module.scss'

import { IListData } from '@/types/list'

interface ICiTable {
    data: IListData
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const CiTable: React.FC<ICiTable> = ({ data, pagination, handleFilterChange }) => {
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    const schemaAttributes = reduceAttributesByTechnicalName(data?.entityStructure)
    const tableData = mapTableData(data?.tableData, schemaAttributes, t, data?.constraintsData) ?? []

    const columnsAttributes = sortAndMergeCiColumns(data?.columnListData)

    const columnsFromApi =
        columnsAttributes?.map((attribute, index) => {
            const technicalName = attribute?.name ?? ''
            const attributeHeader = schemaAttributes[technicalName]?.name ?? t(`${technicalName}`)
            return {
                accessorFn: (row: ColumnsOutputDefinition) => row?.attributes?.[technicalName] ?? row?.metaAttributes?.[technicalName],
                header: attributeHeader ?? technicalName,
                id: technicalName ?? '',
                cell: (ctx: CellContext<ColumnsOutputDefinition, unknown>) => (
                    <TextBody size="S" className={styles.marginBottom0}>
                        {index === 0 ? (
                            <Link to={'./' + ctx?.row?.original?.uuid} className={classNames({ [styles.bold]: ctx.row.getIsSelected() })}>
                                {ctx?.getValue?.() as string}
                            </Link>
                        ) : schemaAttributes[technicalName]?.name ? (
                            (ctx.getValue() as string)
                        ) : (
                            t(`metaAttributes.state.${ctx.getValue()}`)
                        )}
                    </TextBody>
                ),
            }
        }) ?? []

    const columns: Array<ColumnDef<ColumnsOutputDefinition>> = [
        {
            header: ({ table }) => {
                const checked = table.getRowModel().rows.every((row) => (row.original.uuid ? rowSelection[row.original.uuid] === true : false))
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id="checkbox-all"
                            value="checkbox-all"
                            onChange={() => {
                                const result: Record<string, boolean> = {}
                                table.getRowModel().rows.forEach((row) => row.original.uuid && (result[row.original.uuid] = !checked))
                                setRowSelection(result)
                            }}
                            checked={checked}
                            containerClassName={styles.marginBottom15}
                        />
                    </div>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label=""
                        name="checkbox"
                        id={`checkbox_${row.id}`}
                        value="true"
                        onChange={() =>
                            row.original.uuid && setRowSelection({ ...rowSelection, [row.original.uuid]: !rowSelection[row.original.uuid] })
                        }
                        checked={row.original.uuid ? rowSelection[row.original.uuid] : false}
                        containerClassName={styles.marginBottom15}
                    />
                </div>
            ),
        },
        ...columnsFromApi,
    ]

    const isRowSelected = (row: Row<ColumnsOutputDefinition>) => {
        return row.original.uuid ? rowSelection[row.original.uuid] : false
    }

    return (
        <>
            <Table columns={columns} data={tableData} isRowSelected={isRowSelected} />
            <PaginatorWrapper
                {...pagination}
                handlePageChange={(filter) => {
                    setRowSelection({})
                    handleFilterChange(filter)
                }}
            />
        </>
    )
}
