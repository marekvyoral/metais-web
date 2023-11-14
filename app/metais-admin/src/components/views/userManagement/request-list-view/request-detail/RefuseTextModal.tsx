import { BaseModal, Button, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IRefuseTextModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (text: string) => void
}

export const RefuseTextModal = ({ open, onClose, onSubmit }: IRefuseTextModalProps) => {
    const [text, setText] = useState('')
    const { t } = useTranslation()

    return (
        <BaseModal isOpen={open} close={onClose}>
            <TextHeading size="M">{t('requestList.modalLabel')}</TextHeading>
            <TextArea
                name={'modalTextArea'}
                rows={10}
                placeholder={t('requestList.modalTextPlaceHolder')}
                onChange={(e) => {
                    setText(e.target.value)
                }}
            />
            <Button onClick={() => onSubmit(text)} label={t('requestList.decline')} />
        </BaseModal>
    )
}
