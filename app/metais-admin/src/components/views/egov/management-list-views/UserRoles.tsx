import { AccordionContainer, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { RoleOrgIdentity } from '@isdd/metais-common/api/generated/iam-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { getDataForUserRolesTable, getUniqueUserOrg } from './managementListHelpers'

interface RoleTable {
    uuid?: string
    role?: string
    description?: string
}

interface IUserRoles {
    userOrganizations: RoleOrgIdentity[] | undefined
}

enum RoleTableEnum {
    ROLE = 'role',
    DESCRIPTION = 'description',
}

export const UserRoles: React.FC<IUserRoles> = ({ userOrganizations }) => {
    const { t } = useTranslation()

    const userOrg = userOrganizations?.map((item) => ({
        orgId: item.orgId,
        orgName: item.orgName,
        orgNumber: item.orgNumber,
        orgStreet: item.orgStreet,
        orgVillage: item.orgVillage,
        orgZIP: item.orgZIP,
    }))

    const uniqueUserOrg = getUniqueUserOrg(userOrg)

    const roleColumns: ColumnDef<RoleTable>[] = [
        {
            id: RoleTableEnum.ROLE,
            accessorKey: RoleTableEnum.ROLE,
            header: t('managementList.tableHeaderRole'),
        },
        {
            id: RoleTableEnum.DESCRIPTION,
            accessorKey: RoleTableEnum.DESCRIPTION,
            size: 200,
            header: t('managementList.tableHeaderDescription'),
        },
    ]

    const sections =
        uniqueUserOrg?.map((org) => ({
            title: `${org.orgName ?? ''} ${org.orgStreet ? '- ' + org.orgStreet : ''} ${org.orgNumber ? org.orgNumber + ',' : ''} ${
                org.orgZIP ?? ''
            } ${org.orgVillage ?? ''}`,
            summary: null,
            content: <Table<RoleTable> data={getDataForUserRolesTable(userOrganizations, org)} columns={roleColumns} />,
        })) ?? []

    return (
        <>
            <TextHeading size="L">{t('managementList.userRolesHeading')}</TextHeading>
            <AccordionContainer sections={sections} />
        </>
    )
}
