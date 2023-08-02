import { DeleteForeverRed, GreenCheckOutlineIcon } from '@isdd/idsk-ui-kit/assets/images'
import {
    BreadCrumbs,
    Button,
    CheckBox,
    Filter,
    GridRow,
    HomeIcon,
    IconWithText,
    Paginator,
    SimpleSelect,
    Table,
    TextBody,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL, DELETE_CELL } from '@isdd/idsk-ui-kit/table/constants'
import {
    FindRelatedIdentitiesAndCountParams,
    useFindByUuid3,
    useFindRelatedIdentitiesAndCount,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'

import styles from '../styles.module.scss'

import KSIVSAddMemberPopUp from './addMemberPopUp'
import KSIVSTableActions from './tableActions'
import KSIVSDeleteMemberPopUp from './deleteMemberPopUp'
import { DEFAULT_ROLES } from './defaultRoles'

import { NavigationSubRoutes, RouteNames } from '@/navigation/routeNames'

const defaultSearch: FindRelatedIdentitiesAndCountParams = {
    orderBy: 'firstName_lastName',
    desc: false,
    identityState: 'ACTIVATED',
    page: '1',
    perPage: '10',
}

interface TableData {
    uuid: string
    firstName_lastName: string
    organization: string
    roleName: string
    email: string
}

const defaultSort: ColumnSort = {
    orderBy: 'firstName_lastName',
    sortDirection: SortType.ASC,
}

const KSIVSPage = () => {
    const { id } = useParams()
    // const { t } = useTranslation()
    const navigate = useNavigate()

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])
    const [listParams, setListParams] = useState(defaultSearch)
    const { data: infoData } = useFindByUuid3(id ?? '')
    const { data: identitiesData, isLoading: isIdentitiesLoading } = useFindRelatedIdentitiesAndCount(id ?? '', listParams)
    const [successfulUpdatedData, setSuccessfulUpdatedData] = useState(false)
    const columns: ColumnDef<TableData>[] = [
        { technicalName: 'firstName_lastName', name: 'Meno' },
        { technicalName: 'organization', name: 'Organizacia' },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true }))

    const [tableData, setTableData] = useState<TableData[]>()

    useEffect(() => {
        setTableData(
            identitiesData?.list?.map((item) => ({
                uuid: item.identity?.uuid ?? '',
                firstName_lastName: item.identity?.lastName + ' ' + item.identity?.firstName,
                organization: item.gids?.map((org) => org.orgName)?.toString() ?? '',
                roleName: item.gids?.map((org) => org.roleName)?.toString() ?? '',
                email: item.identity?.email ?? '',
            })),
        )
    }, [identitiesData])

    const [rowSelection, setRowSelection] = useState<Record<string, TableData>>({})

    const isRowSelected = (row: Row<TableData>) => {
        return row.original.uuid ? !!rowSelection[row.original.uuid] : false
    }

    const reduceTableDataToObjectWithUuid = <T extends { uuid?: string }>(array: T[]): Record<string, T> => {
        return array.reduce<Record<string, T>>((result, item) => {
            if (item.uuid) {
                result[item.uuid] = item
            }
            return result
        }, {})
    }
    const [identityToDelete, setIdentityToDelete] = useState<string>()
    const SelectableColumnsSpec = (): ColumnDef<TableData>[] => [
        {
            header: ({ table }) => {
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id="checkbox_all"
                            value="true"
                            onChange={() => {
                                const checked = table
                                    .getRowModel()
                                    .rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))
                                const newRowSelection = { ...rowSelection }
                                if (checked) {
                                    table.getRowModel().rows.forEach((row) => row.original.uuid && delete newRowSelection[row.original.uuid])
                                    setRowSelection(newRowSelection)
                                } else {
                                    setRowSelection((val) => ({ ...val, ...reduceTableDataToObjectWithUuid<TableData>(tableData || []) }))
                                }
                            }}
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
                        onChange={() => {
                            if (row.original.uuid) {
                                const newRowSelection = { ...rowSelection }
                                if (rowSelection[row.original.uuid]) {
                                    delete newRowSelection[row.original.uuid]
                                } else {
                                    newRowSelection[row.original.uuid] = row.original
                                }
                                setRowSelection(newRowSelection)
                            }
                        }}
                        checked={row.original.uuid ? !!rowSelection[row.original.uuid] : false}
                    />
                </div>
            ),
        },
        ...columns,
        { header: 'Email', id: 'email', accessorKey: 'email', enableSorting: true },
        {
            header: 'Role',
            id: 'role',
            accessorKey: 'roleName',
            enableSorting: true,
            cell: ({ row }) => {
                const StateWrapper = () => {
                    const [isSelectorShown, setSelectorShown] = useState(false)
                    const [selectedRole, setSelectedRole] = useState(row.original.roleName)
                    if (isSelectorShown) {
                        return (
                            <SimpleSelect
                                value={selectedRole}
                                onChange={(value) => setSelectedRole(value.target.value)}
                                label=""
                                options={DEFAULT_ROLES.map((item) => ({
                                    value: item.code,
                                    label: item.value,
                                }))}
                            />
                        )
                    } else {
                        return (
                            <a
                                className={styles.cursorPointer}
                                onClick={() => {
                                    console.log(isSelectorShown)
                                    setSelectorShown(true)
                                }}
                            >
                                {DEFAULT_ROLES.find((role) => role.description == row.original.roleName)?.value}
                            </a>
                        )
                    }
                }
                return <StateWrapper />
            },
        },
        {
            header: 'Akcia',
            id: DELETE_CELL,
            cell: ({ row }) =>
                !(row.original.roleName == 'STD_KSPRE') && (
                    <img src={DeleteForeverRed} height={24} onClick={() => setIdentityToDelete(row.original.uuid)} />
                ),
        },
    ]
    const [isAddModalOpen, setAddModalOpen] = useState(false)

    return (
        <>
            <KSIVSDeleteMemberPopUp
                isOpen={!!identityToDelete}
                onClose={() => setIdentityToDelete(undefined)}
                uuid={identityToDelete}
                groupUuid={id ?? ''}
            />
            <KSIVSAddMemberPopUp isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} setAddedLabel={setSuccessfulUpdatedData} />
            <BreadCrumbs
                links={[
                    { href: RouteNames.HOME, label: 'Domov', icon: HomeIcon },
                    { href: RouteNames.HOW_TO_STANDARDIZATION, label: 'Štandardizácia' },
                    { href: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU, label: 'Komisia pre štandardizáciu ITVS' },
                ]}
            />
            {/* Base info */}
            <GridRow className={styles.row}>
                <TextHeading size="XL">Komisia pre štandardizáciu ITVS</TextHeading>
                <Button label="Upraviť položku" onClick={() => navigate(NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU + '/edit')} />
            </GridRow>
            <table>
                <tr>
                    <td>
                        <TextBody className={styles.boldText}>Skratka názvu:</TextBody>
                    </td>
                    <td>
                        <TextBody>{infoData?.shortName}</TextBody>
                    </td>
                </tr>
                <tr>
                    <td style={{ verticalAlign: 'baseline' }}>
                        <TextBody className={styles.boldText}>Popis:</TextBody>
                    </td>
                    <td>
                        <TextBody>
                            <div dangerouslySetInnerHTML={{ __html: infoData?.description ?? '' }} />
                        </TextBody>
                    </td>
                </tr>
            </table>
            <TextHeading size="L">Zoznam osôb</TextHeading>
            {/* Filter */}
            <Filter form={() => <></>} defaultFilterValues={{}} />

            {/* Actions */}
            <KSIVSTableActions setAddModalOpen={setAddModalOpen} listParams={listParams} setListParams={setListParams} />

            {/* Success label */}
            {successfulUpdatedData && (
                <IconWithText icon={GreenCheckOutlineIcon}>
                    <TextBody className={styles.greenBoldText}>Člen úspešne pridaný.</TextBody>
                </IconWithText>
            )}

            {/* Table */}
            <Table<TableData>
                onSortingChange={(newSort) => {
                    if (newSort.length > 0) {
                        setListParams({ ...listParams, orderBy: newSort[0].orderBy, desc: newSort[0].sortDirection == SortType.DESC })
                    }
                    setSorting(newSort)
                }}
                isLoading={isIdentitiesLoading}
                sort={sorting}
                columns={SelectableColumnsSpec()}
                data={tableData}
                isRowSelected={isRowSelected}
            />
            {/* Pagination */}
            <Paginator
                pageNumber={Number(listParams.page)}
                pageSize={Number(listParams.perPage)}
                dataLength={identitiesData?.count ?? 0}
                onPageChanged={function (pageNumber: number): void {
                    setListParams({ ...listParams, page: pageNumber.toString() })
                }}
            />
        </>
    )
}

export default KSIVSPage
