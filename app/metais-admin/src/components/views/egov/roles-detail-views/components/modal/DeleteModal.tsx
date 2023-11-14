import { BaseModal, Button, ButtonGroupRow, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import { Pagination } from '@isdd/idsk-ui-kit/types'
import { FindByNameWithParamsParams, Role, useDelete, useFindByNameWithParamsHook } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IDeleteRoleModapProps {
    setTableRoles: React.Dispatch<React.SetStateAction<Role[] | undefined>>
    setRoleToDelete: React.Dispatch<React.SetStateAction<Role | undefined>>
    roleToDelete: Role | undefined
    fetchParams: FindByNameWithParamsParams
    pagination: Pagination
}
export const DeleteRoleModal: React.FC<IDeleteRoleModapProps> = ({ setTableRoles, setRoleToDelete, roleToDelete, fetchParams, pagination }) => {
    const fetchRoles = useFindByNameWithParamsHook()
    const { t } = useTranslation()
    const { mutate: deleteRole } = useDelete({
        mutation: {
            async onSuccess() {
                const roles = await fetchRoles(pagination.pageNumber, pagination.pageSize, fetchParams)
                setRoleToDelete(undefined)
                setTableRoles(roles)
            },
            onError(error) {
                // eslint-disable-next-line no-alert
                alert(error)
            },
        },
    })

    return (
        <BaseModal isOpen={!!roleToDelete} close={() => setRoleToDelete(undefined)}>
            <>
                <TextHeading size="L">{t('adminRolesPage.areYouSure')}</TextHeading>
                <TextBody size="L">{t('adminRolesPage.deleteRoleText')}</TextBody>
                <TextBody size="L">
                    {roleToDelete?.name}: {roleToDelete?.description}
                </TextBody>
                <ButtonGroupRow>
                    <Button
                        label={t('actionsInTable.save')}
                        onClick={() => {
                            deleteRole({ uuid: roleToDelete?.uuid ?? '' })
                        }}
                    />
                    <Button label={t('actionsInTable.cancel')} onClick={() => setRoleToDelete(undefined)} variant="secondary" />
                </ButtonGroupRow>
            </>
        </BaseModal>
    )
}
