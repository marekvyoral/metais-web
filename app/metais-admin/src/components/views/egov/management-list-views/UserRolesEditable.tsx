import { AccordionContainer, Button, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { OrgData } from './UserRolesForm'

interface RoleTableSummary {
    roleId: string
    orgId: string
    role: string
    description: string
}

interface IUserRoles {
    editedUserOrgAndRoles: Record<string, OrgData>
    handleDeleteRole: (roleId: string, orgId: string) => void
}

enum RoleTableSummaryEnum {
    ROLE = 'role',
    DESCRIPTION = 'description',
    DELETE = 'delete',
}

export const UserRolesEditable: React.FC<IUserRoles> = ({ editedUserOrgAndRoles, handleDeleteRole }) => {
    const { t } = useTranslation()

    const editedKeys = Object.keys(editedUserOrgAndRoles)

    const roleColumns: ColumnDef<RoleTableSummary>[] = [
        {
            id: RoleTableSummaryEnum.ROLE,
            accessorKey: RoleTableSummaryEnum.ROLE,
            header: t('managementList.tableHeaderRole'),
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            id: RoleTableSummaryEnum.DESCRIPTION,
            accessorKey: RoleTableSummaryEnum.DESCRIPTION,
            header: t('managementList.tableHeaderDescription'),
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            id: RoleTableSummaryEnum.DELETE,
            accessorFn: (row) => row,
            header: '',
            cell: (row) => {
                const rowObject = row.getValue() as RoleTableSummary
                return (
                    <Button
                        variant="secondary"
                        label={t('managementList.delete')}
                        onClick={() => handleDeleteRole(rowObject.roleId, rowObject.orgId)}
                    />
                )
            },
        },
    ]

    const sections =
        editedKeys.map((key) => {
            const roleKeys = Object.keys(editedUserOrgAndRoles[key].roles)
            const title = `${editedUserOrgAndRoles[key].orgName} ${
                editedUserOrgAndRoles[key].orgStreet ? '- ' + editedUserOrgAndRoles[key].orgStreet : ''
            } ${editedUserOrgAndRoles[key].orgNumber ? editedUserOrgAndRoles[key].orgNumber + ',' : ''} ${editedUserOrgAndRoles[key].orgZIP} ${
                editedUserOrgAndRoles[key].orgVillage
            }`

            return {
                title: title,
                summary: null,
                content: (
                    <Table<RoleTableSummary>
                        data={roleKeys.map((role) => ({
                            roleId: editedUserOrgAndRoles[key].roles[role].uuid,
                            role: editedUserOrgAndRoles[key].roles[role].name,
                            description: editedUserOrgAndRoles[key].roles[role].description,
                            orgId: editedUserOrgAndRoles[key].orgId,
                        }))}
                        columns={roleColumns}
                    />
                ),
            }
        }) ?? []

    return (
        <>
            <TextHeading size="L">{t('managementList.userRolesHeading')}</TextHeading>
            <AccordionContainer sections={sections} />
        </>
    )
}
