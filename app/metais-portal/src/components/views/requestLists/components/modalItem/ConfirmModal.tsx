import { BaseModal, Button, ButtonGroupRow, TextArea, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ApiRequestAction } from '@/components/containers/DetailRequestContainer'

export interface ConfirmModalProps {
    isOpen: boolean
    title?: string
    action?: ApiRequestAction
    description?: string
    close: () => void
    onSubmit: (action: ApiRequestAction, note?: string) => void
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, close, description, onSubmit, action }) => {
    const [note, setNote] = useState<string>('')
    const { t } = useTranslation()
    return action ? (
        <BaseModal isOpen={isOpen} close={close}>
            <TextHeading size="L">{title}</TextHeading>
            <TextBody>
                <span>{description}</span>
            </TextBody>
            {action === ApiRequestAction.REJECT && <TextArea name={'note'} rows={4} value={note} onChange={(e) => setNote(e.target.value)} />}
            <ButtonGroupRow>
                <Button type="button" variant="secondary" label={t('codeListList.requestModal.no')} onClick={close} />
                <Button type="submit" label={t('codeListList.requestModal.yes')} onClick={() => onSubmit(action, note)} />
            </ButtonGroupRow>
        </BaseModal>
    ) : (
        <></>
    )
}
