import { BaseModal, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import { ModalButtons } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface IReValidateModalProps {
    open: boolean
    onClose: () => void
    onSend: () => void
}

export const ReValidateModal: React.FC<IReValidateModalProps> = ({ open, onClose, onSend }) => {
    const { t } = useTranslation()

    return (
        <BaseModal isOpen={open} close={onClose}>
            <TextHeading size="L">{t('ciType.revalidateTitle')}</TextHeading>
            <TextBody>{t('ciType.revalidateWarning')} </TextBody>
            <ModalButtons
                submitButtonLabel={t('modalKris.revalidate.okButton')}
                onSubmit={onSend}
                closeButtonLabel={t('evaluation.cancelBtn')}
                onClose={onClose}
            />
        </BaseModal>
    )
}
