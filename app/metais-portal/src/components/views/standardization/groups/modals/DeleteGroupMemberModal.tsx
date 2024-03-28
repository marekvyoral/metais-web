import { BaseModal, LoadingIndicator, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useDeleteGroupRelationHook } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInvalidateGroupMembersCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ModalButtons } from '@isdd/metais-common/index'

interface DeleteGroupMemberModalProps {
    uuid?: string
    groupUuid: string
    isOpen: boolean
    onClose: () => void
}

const DeleteGroupMemberModal: React.FC<DeleteGroupMemberModalProps> = ({ isOpen, onClose, uuid, groupUuid }) => {
    const { t } = useTranslation()

    const [deletingMember, setDeletingMember] = useState(false)
    const deleteRelationHook = useDeleteGroupRelationHook()
    const invalidateGroupMembersCache = useInvalidateGroupMembersCache(groupUuid ?? '')
    const { setIsActionSuccess, clearAction } = useActionSuccess()

    const handleOnDeleteClick = async () => {
        clearAction()
        setDeletingMember(true)
        await deleteRelationHook(uuid ?? '', groupUuid ?? '')
        setDeletingMember(false)
        invalidateGroupMembersCache.invalidate()
        setIsActionSuccess({
            value: true,
            path: `${NavigationSubRoutes.PRACOVNA_SKUPINA_DETAIL}/itvs`,
            additionalInfo: { entity: 'member', type: 'delete' },
        })
        onClose()
    }

    return (
        <>
            <BaseModal isOpen={isOpen} close={onClose}>
                {deletingMember && <LoadingIndicator layer="dialog" label={t('groups.removingMember')} />}
                <TextHeading size="L">{t('groups.removeGroupMember')}</TextHeading>
                <TextBody>{t('groups.sureRemoveMember')}</TextBody>
                <ModalButtons
                    submitButtonLabel={t('radioButton.yes')}
                    onSubmit={handleOnDeleteClick}
                    closeButtonLabel={t('form.cancel')}
                    onClose={onClose}
                />
            </BaseModal>
        </>
    )
}
export default DeleteGroupMemberModal
