import { DeleteForeverRed, GreenCheckOutlineIcon } from '@isdd/idsk-ui-kit/assets/images'
import { BreadCrumbs, CheckBox, HomeIcon, IconWithText, Paginator, SimpleSelect, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL, DELETE_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import {
    FindRelatedIdentitiesAndCountParams,
    Role,
    useFindAll11Hook,
    useFindRelatedIdentitiesAndCount,
    useFindRelatedIdentitiesAndCountHook,
    useUpdateRoleOnGroupOrgForIdentityHook,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import KSIVSFilter from '../../../../components/views/standartization/identitiesFilter'
import KSIVSAddMemberPopUp from '../../../../components/views/standartization/modals/addMemberModal'
import KSIVSBaseInfo from '../../../../components/views/standartization/modals/baseInfo'
import KSIVSDeleteMemberPopUp from '../../../../components/views/standartization/modals/deleteMemberModal'
import { DEFAULT_ROLES } from '../../../../components/views/standartization/defaultRoles'
import styles from '../../../../components/views/standartization/styles.module.scss'
import KSIVSTableActions from '../../../../components/views/standartization/tableActions'

import { isUserAdmin, reduceTableDataToObjectWithUuid } from '@/components/views/standartization/standartizationUtils'

const defaultSearch: FindRelatedIdentitiesAndCountParams = {
    orderBy: 'firstName_lastName',
    desc: false,
    identityState: 'ACTIVATED',
    page: '1',
    perPage: '10',
}

export interface TableData {
    uuid: string
    firstName_lastName: string
    organization: string
    orgId: string
    roleName: string
    email: string
}

const defaultSort: ColumnSort = {
    orderBy: 'firstName_lastName',
    sortDirection: SortType.ASC,
}

export interface FilterParams extends IFilterParams {
    memberUuid: string
    poUuid: string
    role: string
}

const identitiesFilter: FilterParams = {
    memberUuid: '',
    poUuid: '',
    role: '',
}

const KSIVSPage = () => {
    const { id } = useParams()
    const {
        state: { user },
    } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        setIsAdmin(isUserAdmin(user?.roles) ?? false)
    }, [user])
    // const { t } = useTranslation()

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])
    const [listParams, setListParams] = useState(defaultSearch)
    const [listFilter, setListFilter] = useState(identitiesFilter)
    const updateGroupRequest = useUpdateRoleOnGroupOrgForIdentityHook()
    const findRoleRequest = useFindAll11Hook()
    const fetchIdentitiesData = useFindRelatedIdentitiesAndCountHook()
    const { data: identitiesData, isLoading: isIdentitiesLoading } = useFindRelatedIdentitiesAndCount(id ?? '', {
        ...listParams,
        ...(listFilter.memberUuid != '' && { memberUuid: listFilter.memberUuid }),
        ...(listFilter.poUuid != '' && { poUuid: listFilter.poUuid }),
        ...(listFilter.role != '' && { role: listFilter.role }),
    })
    const [successfulUpdatedData, setSuccessfulUpdatedData] = useState(false)
    const columns: ColumnDef<TableData>[] = [
        { technicalName: 'firstName_lastName', name: 'Meno' },
        { technicalName: 'organization', name: 'Organizacia' },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true }))
    const [identities, setIdentities] = useState(identitiesData)
    const [tableData, setTableData] = useState<TableData[]>()
    useEffect(() => {
        setIdentities(identitiesData)
    }, [identitiesData])
    useEffect(() => {
        setTableData(
            identities?.list?.map((item) => ({
                uuid: item.identity?.uuid ?? '',
                firstName_lastName: item.identity?.lastName + ' ' + item.identity?.firstName,
                organization: item.gids?.map((org) => org.orgName)?.toString() ?? '',
                roleName:
                    (item.gids?.map((org) => org.roleName)?.filter((item1) => DEFAULT_ROLES.map((role) => role.description).includes(item1 ?? '')) ??
                        [])[0] ?? '',
                email: item.identity?.email ?? '',
                orgId: item.gids?.map((org) => org.orgId)?.toString() ?? '',
            })),
        )
    }, [identities])

    const [rowSelection, setRowSelection] = useState<Record<string, TableData>>({})

    const isRowSelected = (row: Row<TableData>) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false)

    const [identityToDelete, setIdentityToDelete] = useState<string>()
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
                    const [selectedRole, setSelectedRole] = useState<string>(row.original.roleName)
                    if (isSelectorShown) {
                        return (
                            <SimpleSelect
                                value={selectedRole}
                                onChange={async (value) => {
                                    setSelectedRole(value.target.value)
                                    const oldRole: Role = (await findRoleRequest({ name: row.original.roleName })) as Role
                                    const newRole: Role = (await findRoleRequest({ name: value.target.value })) as Role
                                    await updateGroupRequest(row.original.uuid, id ?? '', oldRole.uuid ?? '', newRole.uuid ?? '', row.original.orgId)
                                    setSelectorShown(false)
                                    const refetchData = await fetchIdentitiesData(id ?? '', {
                                        ...listParams,
                                        ...(listFilter.memberUuid != '' && { memberUuid: listFilter.memberUuid }),
                                        ...(listFilter.poUuid != '' && { poUuid: listFilter.poUuid }),
                                        ...(listFilter.role != '' && { role: listFilter.role }),
                                    })
                                    setIdentities(refetchData)
                                }}
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
    ]

    if (isAdmin) {
        selectableColumnsSpec.push({
            header: 'Akcia',
            id: DELETE_CELL,
            cell: ({ row }) =>
                !(row.original.roleName == 'STD_KSPRE') && (
                    <img src={DeleteForeverRed} height={24} onClick={() => setIdentityToDelete(row.original.uuid)} />
                ),
        })
    }

    const [isAddModalOpen, setAddModalOpen] = useState(false)

    return (
        <>
            <KSIVSDeleteMemberPopUp
                isOpen={!!identityToDelete}
                onClose={() => setIdentityToDelete(undefined)}
                uuid={identityToDelete}
                groupUuid={id ?? ''}
            />
            <KSIVSAddMemberPopUp
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                setAddedLabel={setSuccessfulUpdatedData}
                groupId={id ?? ''}
            />
            <BreadCrumbs
                links={[
                    { href: RouteNames.HOME, label: 'Domov', icon: HomeIcon },
                    { href: RouteNames.HOW_TO_STANDARDIZATION, label: 'Štandardizácia' },
                    { href: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU, label: 'Komisia pre štandardizáciu ITVS' },
                ]}
            />
            <KSIVSBaseInfo isAdmin={isAdmin} />
            <TextHeading size="L">Zoznam osôb</TextHeading>
            {isAdmin && <KSIVSFilter listFilter={listFilter} setListFilter={setListFilter} defaultFilterValues={identitiesFilter} />}
            <KSIVSTableActions
                setAddModalOpen={setAddModalOpen}
                listParams={listParams}
                setListParams={setListParams}
                userRoles={user?.roles}
                selectedRows={rowSelection}
            />
            {successfulUpdatedData && (
                <IconWithText icon={GreenCheckOutlineIcon}>
                    <TextBody className={styles.greenBoldText}>Člen úspešne pridaný.</TextBody>
                </IconWithText>
            )}
            <Table<TableData>
                onSortingChange={(newSort) => {
                    if (newSort.length > 0) {
                        setListParams({ ...listParams, orderBy: newSort[0].orderBy, desc: newSort[0].sortDirection == SortType.DESC })
                    }
                    setSorting(newSort)
                }}
                isLoading={isIdentitiesLoading}
                sort={sorting}
                columns={selectableColumnsSpec}
                data={tableData}
                isRowSelected={isRowSelected}
            />
            <Paginator
                pageNumber={Number(listParams.page)}
                pageSize={Number(listParams.perPage)}
                dataLength={identitiesData?.count ?? 0}
                onPageChanged={(pageNumber: number) => setListParams({ ...listParams, page: pageNumber.toString() })}
            />
        </>
    )
}

export default KSIVSPage
