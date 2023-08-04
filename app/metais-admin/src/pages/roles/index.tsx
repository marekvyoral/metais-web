import React, { useEffect, useState } from 'react'
import {
    BaseModal,
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    Filter,
    HomeIcon,
    Paginator,
    SimpleSelect,
    Table,
    TextBody,
    TextHeading,
} from '@isdd/idsk-ui-kit'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import {
    useFindByNameWithParams,
    Role,
    useFindByNameWithParamsCount,
    useDelete,
    RelatedRoleType,
} from '@isdd/metais-common/api/generated/iam-swagger'
import { EnumItem, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ColumnDef } from '@tanstack/react-table'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import styles from './roles.module.scss'

interface FilterData extends IFilterParams {
    name: string
    group: string
    system: string
}

interface Pagination {
    page: number
    pageSize: number
}

//Filter
const defaultFilterValues: FilterData = {
    name: '',
    system: 'all',
    group: 'all',
}

//Pagination
const defaultPagination: Pagination = {
    page: 1,
    pageSize: 10,
}

//Sorting
const defaultSort: ColumnSort = {
    orderBy: 'name',
    sortDirection: SortType.ASC,
}

const findGroupName = (code: string | undefined, roleGroupsList: EnumItem[] | undefined, defaultString: string) => {
    return roleGroupsList?.find((e) => e.code == code)?.value ?? defaultString
}

const RolesGroup = 'SKUPINA_ROL'

const ManageRoles: React.FC = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { filter } = useFilterParams<FilterData>(defaultFilterValues)

    const [pagination, setPagination] = useState(defaultPagination)
    const [roleToDelete, setRoleToDelete] = useState<Role>()

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])

    const { data: rolesPages } = useFindByNameWithParamsCount({ ...filter, name: filter.fullTextSearch ?? '' })
    const { data: roleGroups } = useGetValidEnum(RolesGroup)
    const {
        data: roles,
        isLoading,
        isError,
    } = useFindByNameWithParams(pagination.page, pagination.pageSize, {
        ...filter,
        name: filter.fullTextSearch ?? '',
        orderBy: sorting.length > 0 ? sorting[0].orderBy : 'name',
        direction: sorting.length > 0 ? sorting[0].sortDirection : 'asc',
    })

    const [tableRoleGroups, setTableRoleGroups] = useState(roleGroups)

    useEffect(() => {
        setTableRoleGroups(roleGroups)
    }, [roleGroups])

    const columns: ColumnDef<Role>[] = [
        { technicalName: 'name', name: t('adminRolesPage.name') },
        { technicalName: 'description', name: t('adminRolesPage.description') },
        { technicalName: 'assignedGroup', name: t('adminRolesPage.group') },
        { technicalName: 'type', name: t('adminRolesPage.systemRole') },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true, key: e.technicalName }))

    const [tableRoles, setTableRoles] = useState(roles)
    const [tableData, setTableData] = useState(tableRoles)

    useEffect(() => {
        setTableRoles(roles)
    }, [roles])

    useEffect(() => {
        setTableData(
            tableRoles?.map((e) => ({ ...e, assignedGroup: findGroupName(e.assignedGroup, tableRoleGroups?.enumItems, t('adminRolesPage.none')) })),
        )
    }, [tableRoleGroups?.enumItems, tableRoles, t])

    const groups: { value: string; label: string }[] =
        tableRoleGroups?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.value ?? '' })) ?? []

    const { mutate: deleteRole } = useDelete({
        mutation: {
            onSuccess() {
                setTableRoles(roles?.filter((e) => e.uuid != roleToDelete?.uuid))
                setRoleToDelete(undefined)
            },
        },
    })

    const getSelectableColumnsSpec = (): ColumnDef<Role>[] => [
        ...columns,
        {
            id: 'assignedUsers',
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        key={cell.id}
                        label={t('adminRolesPage.assignedUsers')}
                        variant="secondary"
                        className={styles.widthFit}
                        onClick={() => navigate(AdminRouteNames.ROLE_USERS + '/' + cell.row.original.uuid)}
                    />
                </>
            ),
            accessorKey: 'assignedUsers',
        },
        {
            id: 'edit',
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        key={cell.id}
                        label={t('adminRolesPage.edit')}
                        className={styles.widthFit}
                        onClick={() => navigate(AdminRouteNames.ROLE_EDIT + '/' + cell.row.original.uuid)}
                    />
                </>
            ),
            accessorKey: 'edit',
        },
        {
            id: 'delete',
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        key={cell.id}
                        label={t('adminRolesPage.deactivate')}
                        variant="warning"
                        className={styles.widthFit}
                        onClick={() => {
                            setRoleToDelete(cell.row.original)
                        }}
                    />
                </>
            ),
            accessorKey: 'delete',
        },
    ]

    return (
        <>
            <BaseModal isOpen={!!roleToDelete} close={() => setRoleToDelete(undefined)}>
                <>
                    <TextHeading size="M">{t('adminRolesPage.areYouSure')}</TextHeading>
                    <TextBody size="S">{t('adminRolesPage.deleteRoleText')}</TextBody>
                    <TextBody size="S">{roleToDelete?.name + ': ' + roleToDelete?.description}</TextBody>
                    <Button
                        label={t('actionsInTable.save')}
                        onClick={() => {
                            deleteRole({ uuid: roleToDelete?.uuid ?? '' })
                        }}
                    />
                    <Button label={t('actionsInTable.cancel')} onClick={() => setRoleToDelete(undefined)} variant="secondary" />
                </>
            </BaseModal>
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                ]}
            />
            <TextHeading size="L">{t('adminRolesPage.rolesList')}</TextHeading>
            <Filter<FilterData>
                form={(register) => (
                    <>
                        <SimpleSelect
                            {...register('group')}
                            id="1"
                            label={'Group'}
                            options={[{ value: 'all', label: t('adminRolesPage.all') }, ...groups]}
                        />
                        <SimpleSelect
                            {...register('system')}
                            id="2"
                            label={'System'}
                            options={[
                                { value: 'all', label: t('adminRolesPage.all') },
                                { value: RelatedRoleType.SYSTEM, label: t('radioButton.yes') },
                                { value: RelatedRoleType.NON_SYSTEM, label: t('radioButton.no') },
                            ]}
                        />
                    </>
                )}
                defaultFilterValues={defaultFilterValues}
            />
            <ButtonGroupRow className={styles.flexEnd}>
                <Button label={t('adminRolesPage.addNewRole')} onClick={() => navigate(AdminRouteNames.ROLE_NEW)} />
                <TextBody className={styles.marginLeftAuto}>Zobraziť</TextBody>
                <SimpleSelect
                    onChange={(label) => {
                        setPagination({ ...pagination, pageSize: Number(label.target.value) })
                    }}
                    id="select"
                    label=""
                    options={[
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '50', value: '50' },
                        { label: '100', value: '100' },
                    ]}
                />
                <TextBody className={styles.marginLeftAuto}>záznamov</TextBody>
            </ButtonGroupRow>
            <Table<Role>
                onSortingChange={(newSort) => {
                    setSorting(newSort)
                }}
                sort={sorting}
                columns={getSelectableColumnsSpec()}
                isLoading={isLoading}
                error={isError}
                data={tableData}
            />
            <Paginator
                dataLength={rolesPages ?? 0}
                pageNumber={pagination.page}
                pageSize={pagination.pageSize}
                onPageChanged={(pageNumber) => setPagination({ ...pagination, page: pageNumber })}
            />
        </>
    )
}

export default ManageRoles
