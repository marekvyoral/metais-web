import { BaseModal, Button, ButtonGroupRow, LoadingIndicator, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useDeleteGroupRelationHook } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInvalidateGroupMembersCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'

import styles from '@/components/views/standardization/groups/styles.module.scss'
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
    const { setIsActionSuccess } = useActionSuccess()

    const handleOnDeleteClick = async () => {
        setDeletingMember(true)
        await deleteRelationHook(uuid ?? '', groupUuid ?? '')
        setDeletingMember(false)
        invalidateGroupMembersCache.invalidate()
        setIsActionSuccess({
            value: true,
            path: `${NavigationSubRoutes.PRACOVNA_SKUPINA_DETAIL}/${groupUuid}`,
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
                <ButtonGroupRow>
                    <Button className={styles.marginLeftAuto} label={t('radioButton.yes')} onClick={handleOnDeleteClick} />
                    <Button label={t('form.cancel')} variant="secondary" onClick={onClose} />
                </ButtonGroupRow>
            </BaseModal>
        </>
    )
}
export default DeleteGroupMemberModal
