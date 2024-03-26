import { MongoAbility } from '@casl/ability'
import { CheckBox, DeleteForeverRed, TransparentButtonWrapper } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL, DELETE_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { IdentitiesInGroupAndCount, IdentityInGroupData, OperationResult } from '@isdd/metais-common/api/generated/iam-swagger'
import { GROUP_ROLES, KSISVS_ROLES } from '@isdd/metais-common/constants'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { ColumnDef, Row, Table } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import React from 'react'
import { GroupPermissionSubject } from '@isdd/metais-common/hooks/permissions/useGroupsPermissions'

import GroupMemberTableRoleSelector from './components/TableRoleSelector'

import { TableData } from '@/components/containers/standardization/groups/GroupDetailContainer'

const reduceTableDataToObjectWithUuid = <T extends { uuid?: string }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.uuid) {
            result[item.uuid] = item
        }
        return result
    }, {})
}

export const sendBatchEmail = (selectedRows: Record<string, TableData>) => {
    if (Object.keys(selectedRows).length === 0) {
        return
    }
    const emails = Object.entries(selectedRows).map((item) => item[1].email)
    const emailAddresses = emails.join(';')
    const mailtoLink = `mailto:${emailAddresses}`

    window.open(mailtoLink, 'blank')
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
    t: TFunction<'translation', undefined, 'translation'>,
    id: string | undefined,
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<IdentitiesInGroupAndCount, OperationResult>>,
    setIdentities: (value: React.SetStateAction<IdentityInGroupData[] | undefined>) => void,
    setIdentityToDelete: React.Dispatch<React.SetStateAction<string | undefined>>,
    ability: MongoAbility,
    setMembersUpdated: React.Dispatch<React.SetStateAction<boolean>>,
    isKsisvs: boolean,
    setUpdatingMember: React.Dispatch<React.SetStateAction<boolean>>,
    isUserLogged: boolean,
) => {
    const selectableColumnsSpec: ColumnDef<TableData>[] = [
        {
            id: 'lastName_firstName',
            header: t('groups.name'),
            accessorKey: 'lastName_firstName',
            enableSorting: true,
            // sortingFn: 'myCustomSorting',
            size: 180,
        },
        { id: 'orgName', header: t('groups.organization'), accessorKey: 'orgName', enableSorting: true, size: 480 },
    ]

    if (ability.can(Actions.CREATE, GroupPermissionSubject.SEND_EMAIL) || isUserLogged) {
        selectableColumnsSpec.unshift({
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
                            title={t('table.selectAllItems')}
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
                        title={t('table.selectItem', { itemName: row.original.lastName_firstName })}
                    />
                </div>
            ),
            size: 20,
        })
    }
    if (ability.can(Actions.READ, GroupPermissionSubject.GROUP_MEMBER_EMAIL)) {
        selectableColumnsSpec.push({ header: t('groups.email'), id: 'email', accessorKey: 'email', size: 200 })
    }

    selectableColumnsSpec.push({
        header: t('groups.role'),
        id: 'roleName',
        accessorKey: 'roleName',
        enableSorting: true,
        cell: ({ row }) => (
            <GroupMemberTableRoleSelector
                row={row}
                id={id}
                refetch={refetch}
                setIdentities={setIdentities}
                ability={ability}
                setMembersUpdated={setMembersUpdated}
                isKsisvs={isKsisvs}
                setUpdatingMember={setUpdatingMember}
            />
        ),
    })

    if (ability.can(Actions.EDIT, GroupPermissionSubject.GROUPS)) {
        selectableColumnsSpec.push({
            header: t('groups.action'),
            id: DELETE_CELL,
            size: 50,
            cell: ({ row }) =>
                row.original.roleName !== KSISVS_ROLES.STD_KSPRE &&
                (row.original.roleName !== GROUP_ROLES.STD_PSPRE ? (
                    <TransparentButtonWrapper
                        onClick={() => setIdentityToDelete(row.original.uuid)}
                        aria-label={t('delete', { subject: row.original.lastName_firstName })}
                    >
                        <img src={DeleteForeverRed} height={24} alt="" />
                    </TransparentButtonWrapper>
                ) : (
                    <Can I={Actions.EDIT} a={GroupPermissionSubject.GROUP_MASTER}>
                        <TransparentButtonWrapper
                            onClick={() => setIdentityToDelete(row.original.uuid)}
                            aria-label={t('delete', { subject: row.original.lastName_firstName })}
                        >
                            <img src={DeleteForeverRed} height={24} alt="" />
                        </TransparentButtonWrapper>
                    </Can>
                )),
        })
    }
    return selectableColumnsSpec
}
