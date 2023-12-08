import { BaseModal, Button, ButtonGroupRow, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
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
            <ButtonGroupRow>
                <Button label={t('modalKris.revalidate.okButton')} onClick={onSend} />
                <Button
                    variant="secondary"
                    label={t('evaluation.cancelBtn')}
                    onClick={() => {
                        onClose()
                    }}
                />
            </ButtonGroupRow>
        </BaseModal>
    )
}
