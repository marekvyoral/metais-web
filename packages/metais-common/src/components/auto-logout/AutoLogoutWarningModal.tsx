import { BaseModal, TextWarning } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './autoLogout.module.scss'

type Props = {
    isOpen: boolean
    onClose: () => void
    countDown: number
}

export const AutoLogoutWarningModal = ({ isOpen, onClose, countDown }: Props) => {
    const { t } = useTranslation()
    return (
        <BaseModal isOpen={isOpen} close={onClose} widthInPx={640}>
            <div className={styles.messageDiv}>
                <TextWarning>{t('autoLogout.warningMessage', { countDown })}</TextWarning>
            </div>
        </BaseModal>
    )
}
