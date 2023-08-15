import { CheckBox, DeleteForeverRed } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL, DELETE_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Attribute } from '@isdd/metais-common/api'
import { FindRelatedIdentitiesAndCountParams, IdentitiesInGroupAndCount } from '@isdd/metais-common/api/generated/iam-swagger'
import { ColumnDef, Row, Table } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import React from 'react'
import { FieldErrors } from 'react-hook-form'

import KSIVSTableRoleSelector from './components/TableRoleSelector'

import { FilterParams, TableData } from '@/components/containers/KSISVSVContainer'

export const reduceTableDataToObjectWithUuid = <T extends { uuid?: string }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.uuid) {
            result[item.uuid] = item
        }
        return result
    }, {})
}

export const isUserAdmin = (userRoles: string[] | undefined) => {
    return userRoles?.includes('STD_PSPRE') || userRoles?.includes('STD_PSPODP')
}

export const canUserSendEmails = (userRoles: string[] | undefined) => {
    return userRoles?.includes('STD_KSCLEN') || userRoles?.includes('STD_KOORDINATOR_AGENDY')
}

export const canUserSeeEmails = (userRoles: string[] | undefined) => {
    return (
        userRoles?.includes('STD_KSPODP') || userRoles?.includes('STD_KSPRE') || userRoles?.includes('STD_KSTAJ') || userRoles?.includes('STD_PSPRE')
    )
}

export const canUserEditRoles = (userRoles: string[] | undefined) => {
    return userRoles?.includes('STD_KSPODP') || userRoles?.includes('STD_KSPRE') || userRoles?.includes('STD_KSTAJ')
}

export const sendBatchEmail = (selectedRows: Record<string, TableData>) => {
    const emails = Object.entries(selectedRows).map((item) => item[1].email)
    const emailAddresses = emails.join(';')
    const mailtoLink = `mailto:${emailAddresses}?`
    window.location.href = mailtoLink
}

export const hasAttributeInputError = (
    attribute: Attribute,
    errors: FieldErrors<{
        [x: string]: string | number | boolean | Date | null | undefined
    }>,
) => {
    if (attribute.technicalName != null) {
        const error = Object.keys(errors).includes(attribute.technicalName)
        return error ? errors[attribute.technicalName] : undefined
    }
    return undefined
}

const checkRow = (
    row: Row<TableData>,
    rowSelection: Record<string, TableData>,
    setRowSelection: (value: React.SetStateAction<Record<string, TableData>>) => void,
) => {
    if (row.original.uuid) {
        const newRowSelection = { ...rowSelection }
        if (rowSelection[row.original.uuid]) {
            delete newRowSelection[row.original.uuid]
        } else {
            newRowSelection[row.original.uuid] = row.original
        }
        setRowSelection(newRowSelection)
    }
}

const checkAllRows = (
    table: Table<TableData>,
    rowSelection: Record<string, TableData>,
    setRowSelection: (value: React.SetStateAction<Record<string, TableData>>) => void,
    tableData: TableData[] | undefined,
) => {
    const checked = table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))
    const newRowSelection = { ...rowSelection }
    if (checked) {
        table.getRowModel().rows.forEach((row) => row.original.uuid && delete newRowSelection[row.original.uuid])
        setRowSelection(newRowSelection)
    } else {
        setRowSelection((val) => ({ ...val, ...reduceTableDataToObjectWithUuid<TableData>(tableData || []) }))
    }
}

export const buildColumns = (
    rowSelection: Record<string, TableData>,
    setRowSelection: (value: React.SetStateAction<Record<string, TableData>>) => void,
    tableData: TableData[] | undefined,
    columns: ColumnDef<TableData>[],
    userRoles: string[] | undefined,
    t: TFunction<'translation', undefined, 'translation'>,
    id: string | undefined,
    listParams: FindRelatedIdentitiesAndCountParams,
    filter: FilterParams,
    setIdentities: (value: React.SetStateAction<IdentitiesInGroupAndCount | undefined>) => void,
    setIdentityToDelete: (value: React.SetStateAction<string | undefined>) => void,
) => {
    const selectableColumnsSpec: ColumnDef<TableData>[] = [
        {
            header: ({ table }) => {
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id="checkbox_all"
                            value="true"
                            onChange={() => checkAllRows(table, rowSelection, setRowSelection, tableData)}
                            checked={table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))}
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
                        onChange={() => checkRow(row, rowSelection, setRowSelection)}
                        checked={row.original.uuid ? !!rowSelection[row.original.uuid] : false}
                    />
                </div>
            ),
        },
        ...columns,
    ]
    if (canUserSeeEmails(userRoles)) {
        selectableColumnsSpec.push({ header: t('KSIVSPage.email'), id: 'email', accessorKey: 'email', enableSorting: true })
    }
    selectableColumnsSpec.push({
        header: t('KSIVSPage.role'),
        id: 'role',
        accessorKey: 'roleName',
        enableSorting: true,
        cell: ({ row }) => (
            <KSIVSTableRoleSelector row={row} id={id} userRoles={userRoles} filter={filter} listParams={listParams} setIdentities={setIdentities} />
        ),
    })

    if (isUserAdmin(userRoles)) {
        selectableColumnsSpec.push({
            header: t('KSIVSPage.action'),
            id: DELETE_CELL,
            cell: ({ row }) =>
                !(row.original.roleName == 'STD_KSPRE') && (
                    <img src={DeleteForeverRed} height={24} onClick={() => setIdentityToDelete(row.original.uuid)} />
                ),
        })
    }
    return selectableColumnsSpec
}
