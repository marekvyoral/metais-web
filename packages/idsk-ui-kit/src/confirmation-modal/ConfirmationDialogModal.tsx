import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './confirmationModal.module.scss'

import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

export interface IConfirmationProps {
    title?: string
    content?: React.ReactNode
    isOpen: boolean
    icon?: string
    showOKButton?: boolean
    okButtonLabel?: string
    okButtonVariant?: 'warning' | 'secondary' | undefined
    showCancelButton?: boolean
    onClose: () => void
    onConfirm: () => void
}

export const ConfirmationModal: React.FC<IConfirmationProps> = ({
    title,
    content,
    isOpen,
    icon,
    okButtonLabel,
    showOKButton = true,
    showCancelButton = true,
    okButtonVariant = 'warning',
    onClose,
    onConfirm,
}) => {
    const { t } = useTranslation()
    return (
        <BaseModal isOpen={isOpen} close={onClose}>
            <div className={styles.modalContainer}>
                <TextHeading size={'L'} className={styles.heading}>
                    <>
                        {title}
                        {icon && (
                            <div className={styles.icon}>
                                <img className={styles.iconWidth} src={icon} alt="modal-icon" />
                            </div>
                        )}
                    </>
                </TextHeading>
                <div className={styles.content}>
                    <div className="govuk-radios--small">{content}</div>
                    <div className={styles.buttonGroup}>
                        {showCancelButton && <Button label={t('confirmationModal.cancelButtonLabel')} variant="secondary" onClick={onClose} />}
                        {showOKButton && (
                            <Button
                                label={okButtonLabel ? okButtonLabel : t('confirmationModal.okButtonLabel')}
                                variant={okButtonVariant}
                                onClick={onConfirm}
                            />
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}
