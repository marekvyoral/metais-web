import { BaseModal, Button, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import { FindByNameWithParamsParams, Role, useDelete, useFindByNameWithParamsHook } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Pagination } from '@/pages/roles'

interface DeleteRoleModapProps {
    setTableRoles: React.Dispatch<React.SetStateAction<Role[] | undefined>>
    setRoleToDelete: React.Dispatch<React.SetStateAction<Role | undefined>>
    roleToDelete: Role | undefined
    fetchParams: FindByNameWithParamsParams
    pagination: Pagination
}
const DeleteRoleModal: React.FC<DeleteRoleModapProps> = ({ setTableRoles, setRoleToDelete, roleToDelete, fetchParams, pagination }) => {
    const fetchRoles = useFindByNameWithParamsHook()
    const { t } = useTranslation()
    const { mutate: deleteRole } = useDelete({
        mutation: {
            async onSuccess() {
                const roles = await fetchRoles(pagination.page, pagination.pageSize, fetchParams)
                setRoleToDelete(undefined)
                setTableRoles(roles)
            },
        },
    })

    return (
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
    )
}

export default DeleteRoleModal
