import React from 'react'
import { useTranslation } from 'react-i18next'
import { ModalButtons } from '@isdd/metais-common'

import styles from './confirmationModal.module.scss'

import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'

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
                                <img className={styles.iconWidth} src={icon} alt="" />
                            </div>
                        )}
                    </>
                </TextHeading>
                <div className={styles.content}>{content}</div>
            </div>
            <ModalButtons
                {...(showOKButton && { submitButtonLabel: okButtonLabel ? okButtonLabel : t('confirmationModal.okButtonLabel') })}
                onSubmit={onConfirm}
                submitButtonVariant={okButtonVariant}
                closeButtonLabel={t('confirmationModal.cancelButtonLabel')}
                {...(showCancelButton && { onClose })}
            />
        </BaseModal>
    )
}
