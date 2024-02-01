import React, { useCallback } from 'react'
import { BaseModal, TextBody } from '@isdd/idsk-ui-kit/index'
import { useGenerateReferenceRegisterByUuidHook } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useTranslation } from 'react-i18next'
import { DMS_DOWNLOAD_FILE } from '@isdd/metais-common/api/constants'
import { ModalButtons } from '@isdd/metais-common/index'

import { downloadFile } from '@/components/views/documents/utils'

interface IRefRegisterGeneratePropDialog {
    openGeneratePropDialog: boolean
    setOpenGeneratePropDialog: (state: boolean) => void
    entityId: string
}

export const RefRegisterGeneratePropDialog = ({ openGeneratePropDialog, setOpenGeneratePropDialog, entityId }: IRefRegisterGeneratePropDialog) => {
    const { t } = useTranslation()
    const generateDoc = useGenerateReferenceRegisterByUuidHook()

    const onSubmit = useCallback(async () => {
        const generatedDocs = await generateDoc(entityId)
        downloadFile(`${DMS_DOWNLOAD_FILE}/${generatedDocs?.uuid}`, generatedDocs?.filename ?? '')
        setOpenGeneratePropDialog(false)
    }, [entityId, generateDoc, setOpenGeneratePropDialog])

    return (
        <BaseModal isOpen={openGeneratePropDialog} close={() => setOpenGeneratePropDialog(false)}>
            <TextBody size="S">{t('refRegisters.header.generateProp1')}</TextBody>
            <TextBody size="S">{t('refRegisters.header.generateProp2')}</TextBody>

            <ModalButtons
                submitButtonLabel={t('refRegisters.header.generateProp')}
                onSubmit={onSubmit}
                closeButtonLabel={t('evaluation.cancelBtn')}
                onClose={() => setOpenGeneratePropDialog(false)}
            />
        </BaseModal>
    )
}
