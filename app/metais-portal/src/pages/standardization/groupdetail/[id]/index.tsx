import { DeleteForeverRed, GreenCheckOutlineIcon } from '@isdd/idsk-ui-kit/assets/images'
import { BreadCrumbs, HomeIcon, IconWithText, Paginator, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { DELETE_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import {
    FindRelatedIdentitiesAndCountParams,
    useFindAll11Hook,
    useFindRelatedIdentitiesAndCount,
    useFindRelatedIdentitiesAndCountHook,
    useUpdateRoleOnGroupOrgForIdentityHook,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { DEFAULT_ROLES } from '../../../../components/views/standartization/defaultRoles'
import KSIVSFilter from '../../../../components/views/standartization/identitiesFilter'
import KSIVSAddMemberPopUp from '../../../../components/views/standartization/modals/addMemberModal'
import KSIVSBaseInfo from '../../../../components/views/standartization/modals/baseInfo'
import KSIVSDeleteMemberPopUp from '../../../../components/views/standartization/modals/deleteMemberModal'
import styles from '../../../../components/views/standartization/styles.module.scss'
import KSIVSTableActions from '../../../../components/views/standartization/tableActions'

import { buildColumns, isUserAdmin } from '@/components/views/standartization/standartizationUtils'

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
    const { t } = useTranslation()

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])
    const [listParams, setListParams] = useState(defaultSearch)
    const { filter } = useFilterParams<FilterParams>(identitiesFilter)

    const updateGroupRequest = useUpdateRoleOnGroupOrgForIdentityHook()
    const findRoleRequest = useFindAll11Hook()
    const fetchIdentitiesData = useFindRelatedIdentitiesAndCountHook()
    const { data: identitiesData, isLoading: isIdentitiesLoading } = useFindRelatedIdentitiesAndCount(id ?? '', {
        ...listParams,
        ...(filter.memberUuid != undefined && { memberUuid: filter.memberUuid }),
        ...(filter.poUuid != undefined && { poUuid: filter.poUuid }),
        ...(filter.role != 'all' && filter.role != undefined && { role: filter.role }),
        ...(filter.fullTextSearch != undefined && { expression: filter.fullTextSearch }),
    })
    const [successfulUpdatedData, setSuccessfulUpdatedData] = useState(false)
    const columns: ColumnDef<TableData>[] = [
        { technicalName: 'firstName_lastName', name: t('KSIVSPage.name') },
        { technicalName: 'organization', name: t('KSIVSPage.organization') },
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
    const selectableColumnsSpec: ColumnDef<TableData>[] = buildColumns(
        rowSelection,
        setRowSelection,
        tableData,
        columns,
        user?.roles,
        t,
        findRoleRequest,
        updateGroupRequest,
        fetchIdentitiesData,
        id,
        listParams,
        filter,
        setIdentities,
        setIdentityToDelete,
    )

    if (isAdmin) {
        selectableColumnsSpec.push({
            header: t('KSIVSPage.action'),
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
                    { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                    { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                    { href: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU, label: t('KSIVSPage.title') },
                ]}
            />
            <KSIVSBaseInfo isAdmin={isAdmin} />
            <TextHeading size="L">{t('KSIVSPage.listOfPersons')}</TextHeading>
            {isAdmin && <KSIVSFilter defaultFilterValues={identitiesFilter} />}
            <KSIVSTableActions
                setAddModalOpen={setAddModalOpen}
                listParams={listParams}
                setListParams={setListParams}
                userRoles={user?.roles}
                selectedRows={rowSelection}
                groupUuid={id}
            />
            {successfulUpdatedData && (
                <IconWithText icon={GreenCheckOutlineIcon}>
                    <TextBody className={styles.greenBoldText}>{t('KSIVSPage.memberSuccessfullyAdded')}</TextBody>
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
