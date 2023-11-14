import { Button, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { RoleItem } from './RequestRolesForm'

interface RequetRoleTableSummary {
    roleId: string
    role: string
    description: string
}

interface IRequestRolesEditableProps {
    roles: Record<string, RoleItem>
    handleDeleteRole: (roleId: string) => void
}

enum RoleTableSummaryEnum {
    ROLE = 'role',
    DESCRIPTION = 'description',
    DELETE = 'delete',
}

export const RequestRolesEditable: React.FC<IRequestRolesEditableProps> = ({ roles, handleDeleteRole }) => {
    const { t } = useTranslation()

    const roleColumns: ColumnDef<RequetRoleTableSummary>[] = [
        {
            id: RoleTableSummaryEnum.ROLE,
            accessorKey: RoleTableSummaryEnum.ROLE,
            header: t('managementList.tableHeaderRole'),
        },
        {
            id: RoleTableSummaryEnum.DESCRIPTION,
            accessorKey: RoleTableSummaryEnum.DESCRIPTION,
            header: t('managementList.tableHeaderDescription'),
        },
        {
            id: RoleTableSummaryEnum.DELETE,
            accessorFn: (row) => row,
            header: '',
            cell: (row) => {
                const rowObject = row.getValue() as RequetRoleTableSummary
                return <Button variant="secondary" label={t('managementList.delete')} onClick={() => handleDeleteRole(rowObject.roleId)} />
            },
        },
    ]

    return (
        <>
            <TextHeading size="M">{t('requestList.addRolesDetail')}</TextHeading>
            <Table<RequetRoleTableSummary>
                data={Object.values(roles).map((role) => ({
                    roleId: role.uuid,
                    role: role.name,
                    description: role.description,
                }))}
                columns={roleColumns}
            />
        </>
    )
}
