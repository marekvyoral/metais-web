import { BaseModal, Button, ButtonGroupRow, LoadingIndicator, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useDeleteGroupRelationHook } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from '@/components/views/standartization/groups/styles.module.scss'
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

    const handleOnDeleteClick = async () => {
        setDeletingMember(true)
        await deleteRelationHook(uuid ?? '', groupUuid ?? '')
        setDeletingMember(false)
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
