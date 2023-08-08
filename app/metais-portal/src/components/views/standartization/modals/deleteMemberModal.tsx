import { BaseModal, Button, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useDeleteGroupRelationHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useTranslation } from 'react-i18next'

import styles from '../styles.module.scss'
interface deleteMemberPopUpProps {
    uuid?: string
    groupUuid: string
    isOpen: boolean
    onClose: () => void
}

const KSIVSDeleteMemberPopUp: React.FC<deleteMemberPopUpProps> = ({ isOpen, onClose, uuid, groupUuid }) => {
    const deleteRelation = useDeleteGroupRelationHook()
    const { t } = useTranslation()
    return (
        <>
            <BaseModal isOpen={isOpen} close={onClose}>
                <TextHeading size="L">{t('KSIVSPage.removeGroupMember')}</TextHeading>
                <TextBody>{t('KSIVSPage.sureRemoveMember')}</TextBody>
                <div className={styles.displayFlex}>
                    <Button
                        className={styles.marginLeftAuto}
                        label={t('radioButton.yes')}
                        onClick={() => {
                            deleteRelation(uuid ?? '', groupUuid)
                            onClose()
                        }}
                    />
                    <Button label={t('form.cancel')} variant="secondary" onClick={onClose} />
                </div>
            </BaseModal>
        </>
    )
}
export default KSIVSDeleteMemberPopUp
