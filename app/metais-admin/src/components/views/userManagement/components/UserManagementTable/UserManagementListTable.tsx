import React, { useCallback } from 'react'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CheckBox, TextLink, SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { IdentityState } from '@isdd/metais-common/api/generated/iam-swagger'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import { Tooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { truncateWithEllipsis } from '@isdd/metais-common/componentHelpers/formatting/ellipsis'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'

import styles from './userManagementListTable.module.scss'

import { extractOrganizationNamesFromCi } from '@/components/views/userManagement/userManagementUtils'
import {
    UserManagementActionsOverRowEnum,
    UserManagementListItem,
    reduceRowsToObject,
    UserManagementListData,
    UserManagementFilterData,
} from '@/components/containers/ManagementList/UserManagementListUtils'

interface UserManagementTableProps {
    data: UserManagementListData
    filter: UserManagementFilterData
    rowSelection: Record<string, UserManagementListItem>
    setRowSelection: (item: Record<string, UserManagementListItem>) => void
    handleRowAction: (identity: { uuid: string; login: string }, action: UserManagementActionsOverRowEnum, isCurrentlyBlocked?: boolean) => void
    handleFilterChange: (filter: IFilter) => void
}

export const UserManagementListTable: React.FC<UserManagementTableProps> = ({
    data,
    filter,
    rowSelection,
    setRowSelection,
    handleRowAction,
    handleFilterChange,
}) => {
    const { t } = useTranslation()
    const { pageNumber, pageSize } = filter

    const handleAllCheckboxChange = useCallback(
        (rows: UserManagementListItem[]) => {
            const rowsWithoutLoggedInUser = rows.filter((row) => !row.isLoggedInUser)
            const checked = rowsWithoutLoggedInUser.every(({ identity: { uuid } }) => (uuid ? !!rowSelection[uuid] : false))
            if (checked) {
                setRowSelection({})
            } else {
                setRowSelection(reduceRowsToObject(rowsWithoutLoggedInUser))
            }
        },
        [rowSelection, setRowSelection],
    )
    const handleCheckboxChange = useCallback(
        (row: Row<UserManagementListItem>) => {
            if (!row.original.identity.uuid) return
            const { uuid } = row.original.identity
            const newRowSelection = { ...rowSelection }
            if (rowSelection[uuid]) {
                delete newRowSelection[uuid]
            } else {
                newRowSelection[uuid] = row.original
            }
            setRowSelection(newRowSelection)
        },
        [rowSelection, setRowSelection],
    )
    const clearSelectedRows = useCallback(() => setRowSelection({}), [setRowSelection])
    const isRowSelected = useCallback(
        (row: Row<UserManagementListItem>) => {
            return row.original.identity.uuid ? !!rowSelection[row.original.identity.uuid] : false
        },
        [rowSelection],
    )

    const columns: Array<ColumnDef<UserManagementListItem>> = [
        {
            header: ({ table }) => {
                const checked = table
                    .getRowModel()
                    .rows.filter((row) => !row.original.isLoggedInUser)
                    .every((row) => (row.original.identity.uuid ? !!rowSelection[row.original.identity.uuid] : false))
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id="checkbox-all"
                            value="checkbox-all"
                            onChange={() => handleAllCheckboxChange(data.list)}
                            checked={checked}
                            containerClassName={styles.marginBottom15}
                        />
                    </div>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }) => {
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id={`checkbox_${row.id}`}
                            value="true"
                            onChange={() => handleCheckboxChange(row)}
                            disabled={row.original.isLoggedInUser}
                            checked={row.original.identity.uuid ? !!rowSelection[row.original.identity.uuid] : false}
                            containerClassName={styles.marginBottom15}
                        />
                    </div>
                )
            },
        },
        {
            header: t('userManagement.fullName'),
            accessorFn: (ctx) => ({
                fullName: [ctx.identity.firstName, ctx.identity.lastName].join(' '),
                uuid: ctx.identity.uuid,
            }),
            cell: ({ cell }) => {
                const { fullName, uuid } = cell.getValue() as { fullName: string; uuid: string }
                return fullName ?? <TextLink to={`${AdminRouteNames.USER_MANAGEMENT}/detail/${uuid}`}>{fullName}</TextLink>
            },
            enableSorting: true,
            id: 'lastName',
        },
        {
            header: t('userManagement.actions'),
            cell: ({
                row: {
                    original: { isLoggedInUser, identity },
                },
            }) => (
                <SimpleSelect
                    label=""
                    defaultValue=""
                    placeholder={t('userManagement.actions')}
                    options={[
                        {
                            label: identity.state === IdentityState.BLOCKED ? t('userManagement.unblock') : t('userManagement.block'),
                            value: UserManagementActionsOverRowEnum.BLOCK,
                            disabled: isLoggedInUser,
                        },
                        {
                            label: t('userManagement.edit'),
                            value: UserManagementActionsOverRowEnum.EDIT,
                        },
                        {
                            label: t('userManagement.changePassword'),
                            value: UserManagementActionsOverRowEnum.CHANGE_PASSWORD,
                        },
                    ]}
                    name="actions"
                    onChange={(value) =>
                        handleRowAction(
                            {
                                uuid: identity.uuid || '',
                                login: identity.login || '',
                            },
                            value as UserManagementActionsOverRowEnum,
                            identity.state === IdentityState.BLOCKED,
                        )
                    }
                />
            ),
            id: 'actions',
        },
        { header: t('userManagement.login'), accessorFn: (row) => row.identity.login, enableSorting: true, id: 'login' },
        { header: t('userManagement.phone'), accessorFn: (row) => row.identity.phone, enableSorting: true, id: 'phone' },
        { header: t('userManagement.mobile'), accessorFn: (row) => row.identity.mobile, enableSorting: true, id: 'mobile' },
        {
            header: t('userManagement.organization'),
            accessorFn: (row) => extractOrganizationNamesFromCi(row.ciItems),
            cell: (ctx) => {
                const names: string[] = ctx.cell.getValue() as string[]
                if (!names) return

                const isFirstRow = ctx.table.getSortedRowModel().rows[0] === ctx.row
                const joinedNames = names.join(', ')
                const anchor = `anchor-element-${ctx.row.id}`
                return (
                    <>
                        <Tooltip anchorSelect={`.${anchor}`} place={isFirstRow ? 'bottom' : 'top'} clickable>
                            <TextBody size="S" className={styles.tooltipBody}>
                                {joinedNames}
                            </TextBody>
                        </Tooltip>
                        <span className={anchor}>
                            {truncateWithEllipsis(joinedNames)}
                            {names.length > 1 && <> (+{names.length - 1})</>}
                        </span>
                    </>
                )
            },
            id: 'organization',
        },
        {
            header: t('userManagement.state'),
            accessorFn: (row) => row.identity.state,
            cell: ({ cell }) =>
                cell.getValue() === IdentityState.BLOCKED ? <span className={styles.redColor}>{t('userManagement.states.blocked')}</span> : '',
            id: 'state',
        },
    ]

    return (
        <Table
            data={data.list}
            columns={columns}
            pagination={{ pageIndex: pageNumber ?? BASE_PAGE_NUMBER, pageSize: pageSize ?? BASE_PAGE_SIZE }}
            sort={filter.sort ?? []}
            isRowSelected={isRowSelected}
            onSortingChange={(columnSort) => {
                handleFilterChange({ sort: columnSort })
                clearSelectedRows()
            }}
        />
    )
}