import { BaseModal, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import { Pagination } from '@isdd/idsk-ui-kit/types'
import { FindByNameWithParamsParams, Role, useDelete, useFindByNameWithParamsHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { ModalButtons, MutationFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
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
    const [error, setError] = useState<string>()
    const { mutate: deleteRole } = useDelete({
        mutation: {
            async onSuccess() {
                const roles = await fetchRoles(pagination.pageNumber, pagination.pageSize, fetchParams)
                setRoleToDelete(undefined)
                setTableRoles(roles)
            },
            onError(requestError) {
                if (JSON.parse(requestError.message as string).type == ReponseErrorCodeEnum.OPERATION_NOT_ALLOWED) {
                    setError(t('feedback.roleHasRelations'))
                } else {
                    setError(JSON.parse(requestError.message as string).message)
                }
            },
        },
    })

    return (
        <BaseModal isOpen={!!roleToDelete} close={() => setRoleToDelete(undefined)}>
            <>
                <TextHeading size="L">{t('adminRolesPage.areYouSure')}</TextHeading>
                <MutationFeedback success={false} error={error} onMessageClose={() => setError('')} />
                <TextBody size="L">{t('adminRolesPage.deleteRoleText')}</TextBody>
                <TextBody size="L">
                    {roleToDelete?.name}: {roleToDelete?.description}
                </TextBody>
                <ModalButtons
                    submitButtonLabel={t('radioButton.yes')}
                    onSubmit={() => deleteRole({ uuid: roleToDelete?.uuid ?? '' })}
                    closeButtonLabel={t('actionsInTable.cancel')}
                    onClose={() => setRoleToDelete(undefined)}
                />
            </>
        </BaseModal>
    )
}
