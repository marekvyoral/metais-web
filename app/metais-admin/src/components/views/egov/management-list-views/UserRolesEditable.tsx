import { AccordionContainer, Button, ButtonGroupRow, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { OrgData } from './UserRolesForm'
import { DeletePoModal } from './DeletePoModal'

interface RoleTableSummary {
    roleId: string
    orgId: string
    role: string
    description: string
}

interface IUserRoles {
    editedUserOrgAndRoles: Record<string, OrgData>
    handleDeleteOrg: (id: string) => void
    openModal: (id: string) => void
}

enum RoleTableSummaryEnum {
    ROLE = 'role',
    DESCRIPTION = 'description',
    DELETE = 'delete',
}

export const UserRolesEditable: React.FC<IUserRoles> = ({ editedUserOrgAndRoles, handleDeleteOrg, openModal }) => {
    const { t } = useTranslation()

    const editedKeys = Object.keys(editedUserOrgAndRoles)
    const [modalDeleteOpen, setModalDeleteOpen] = useState<OrgData>()

    const openDeleteModal = (key: string) => {
        setModalDeleteOpen(editedUserOrgAndRoles[key])
    }

    const onDeleteClose = () => {
        setModalDeleteOpen(undefined)
    }

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
            size: 200,
            header: t('managementList.tableHeaderDescription'),
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
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
                    <>
                        <ButtonGroupRow>
                            <Button
                                label={t('managementList.updatePo')}
                                variant="secondary"
                                onClick={() => {
                                    openModal(editedUserOrgAndRoles[key].orgId)
                                }}
                            />
                            <Button
                                label={t('managementList.deletePo')}
                                variant="warning"
                                onClick={() => {
                                    openDeleteModal(key)
                                }}
                            />
                        </ButtonGroupRow>
                        <Table<RoleTableSummary>
                            data={roleKeys.map((role) => ({
                                roleId: editedUserOrgAndRoles[key].roles[role].uuid,
                                role: editedUserOrgAndRoles[key].roles[role].name,
                                description: editedUserOrgAndRoles[key].roles[role].description,
                                orgId: editedUserOrgAndRoles[key].orgId,
                            }))}
                            columns={roleColumns}
                        />
                    </>
                ),
            }
        }) ?? []

    return (
        <>
            <TextHeading size="L">{t('managementList.userRolesHeading')}</TextHeading>
            <AccordionContainer sections={sections} />
            <DeletePoModal deletedPo={modalDeleteOpen} close={onDeleteClose} handleDeleteOrg={handleDeleteOrg} />
        </>
    )
}
