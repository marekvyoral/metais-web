import { Button, CheckBox } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { createFullAdressFromAttributes } from '@isdd/metais-common/componentHelpers/formatting/attributesCombinations'
import { ColumnDef, Row } from '@tanstack/react-table'
import { Dispatch, FormEvent, SetStateAction, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import styles from './egovTable.module.scss'

import { IActions } from '@/components/containers/Egov/Entity/PublicAuthoritiesListContainer'
import { ConfItemWithBlockedAndMessage } from '@/components/containers/public-authorities/PublicAuthoritiesAssignedContainer'

type PublicAuthoritiesTableProps = {
    data?: void | ConfItemWithBlockedAndMessage[] | undefined
    assignedOrganizations?: void | ConfigurationItemUi[] | undefined
    handleFilterChange: (filter: IFilter) => void
    pagination: Pagination
    sort: ColumnSort[]
    isLoading: boolean
    error?: boolean
    setSelectedRows: Dispatch<SetStateAction<ConfigurationItemUi[]>>
    selectedRows: ConfigurationItemUi[]
    onSubmit: (newConfItems: ConfigurationItemUi[]) => Promise<void>
}

export const PublicAuthoritiesAssignedTable = ({
    data,
    assignedOrganizations,
    handleFilterChange,
    pagination,
    sort,
    isLoading,
    error,
    setSelectedRows,
    selectedRows,
    onSubmit,
}: PublicAuthoritiesTableProps & IActions) => {
    const { t } = useTranslation()
    const location = useLocation()
    const handleSubmit = (e: FormEvent) => {
        e?.preventDefault()
        onSubmit(selectedRows)
    }

    const handleSelectRows = useCallback(
        (row: ConfItemWithBlockedAndMessage, isDefaultChecked?: boolean, isChecked?: boolean) => {
            const isDefaultDeselected = isDefaultChecked && !isChecked
            const isNewValueSelected = isChecked && !isDefaultChecked
            if (isDefaultDeselected || isNewValueSelected) return setSelectedRows([...selectedRows, { ...row }])
            else return setSelectedRows([...(selectedRows?.filter((ci) => ci?.uuid !== row?.uuid) ?? [])])
        },
        [selectedRows, setSelectedRows],
    )

    const isRowDanger = (row: Row<ConfItemWithBlockedAndMessage>) => row.original.blocked
    const columns: Array<ColumnDef<ConfItemWithBlockedAndMessage>> = [
        {
            header: t('table.name'),
            accessorFn: (row) => row?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => (
                <Link to={'/organizations/' + ctx?.row?.original?.uuid} state={{ from: location }}>
                    {ctx?.getValue?.() as string}
                </Link>
            ),
        },
        {
            header: t('table.ico'),
            accessorFn: (row) => row?.attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_ico],
            enableSorting: true,
            id: 'technicalName',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('table.adress'),
            accessorFn: (row) => createFullAdressFromAttributes(row?.attributes),
            enableSorting: true,
            id: 'adress',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('actionsInTable.assignment'),
            id: 'organizationsActions',
            cell: (ctx) => {
                const isDefaultChecked = assignedOrganizations?.some((ci) => ci?.uuid === ctx?.row?.original?.uuid)
                const isCurrentlySelected = selectedRows?.some((ci) => ci?.uuid === ctx?.row?.original?.uuid)

                if (ctx?.row?.original?.blocked)
                    return (
                        <Tooltip
                            descriptionElement={ctx?.row?.original?.blockMessage ?? 'Test Message'}
                            tooltipContent={() => (
                                <div className="govuk-checkboxes govuk-checkboxes--small">
                                    <CheckBox
                                        label=""
                                        name={ctx?.row?.original?.uuid ?? ''}
                                        id={`assignment_${ctx?.row?.original?.uuid}`}
                                        defaultChecked={(isDefaultChecked || isCurrentlySelected) && !(isDefaultChecked && isCurrentlySelected)}
                                        disabled={ctx?.row?.original?.blocked}
                                        onChange={(e) => handleSelectRows(ctx?.row?.original, isDefaultChecked, e?.target?.checked)}
                                    />
                                </div>
                            )}
                            position={'right bottom'}
                            arrow={false}
                        />
                    )
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name={ctx?.row?.original?.uuid ?? ''}
                            id={`assignment_${ctx?.row?.original?.uuid}`}
                            defaultChecked={(isDefaultChecked || isCurrentlySelected) && !(isDefaultChecked && isCurrentlySelected)}
                            disabled={ctx?.row?.original?.blocked}
                            onChange={(e) => handleSelectRows(ctx?.row?.original, isDefaultChecked, e?.target?.checked)}
                        />
                    </div>
                )
            },
        },
    ]
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Table data={data ?? []} columns={columns} sort={sort} isLoading={isLoading} error={error} isRowDanger={isRowDanger} />
                <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
                <div className={styles.submitButtonPadding}>
                    <Button label={t('publicAuthorities.assigned.save')} type="submit" disabled={!selectedRows?.length} />
                </div>
            </form>
        </div>
    )
}
