import React, { useCallback } from 'react'
import { BaseModal, Button, TextBody } from '@isdd/idsk-ui-kit/index'
import { useGenerateReferenceRegisterByUuidHook } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useTranslation } from 'react-i18next'
import { DMS_DOWNLOAD_FILE } from '@isdd/metais-common/api'

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

            <Button label={t('refRegisters.header.generateProp')} onClick={onSubmit} />
        </BaseModal>
    )
}
