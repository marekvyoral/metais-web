import React, { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/src/button/Button'

import { ImportIcon } from '@isdd/metais-common/assets/images'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
import { FileImport } from '@isdd/metais-common/components/file-import/FileImport'
import { FileImportStepEnum } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'

export interface IImportButtonProps {
    ciType: string
    ciTypeName?: string
}

export const ImportButton: React.FC<IImportButtonProps> = ({ ciType, ciTypeName }) => {
    const { t } = useTranslation()
    const [modalImportOpen, setModalImportOpen] = useState(false)
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)
    const modalId = useId()

    const baseURL = import.meta.env.VITE_REST_CLIENT_IMPEXP_CMDB_TARGET_URL
    const fileImportURL = `${baseURL}${fileImportStep === FileImportStepEnum.VALIDATE ? '/import/validate' : '/import'}`

    const openImportModal = () => {
        setModalImportOpen(true)
    }
    const onImportClose = () => {
        setFileImportStep(FileImportStepEnum.VALIDATE)
        setModalImportOpen(false)
    }

    return (
        <>
            <Button
                onClick={openImportModal}
                variant="secondary"
                className="marginBottom0"
                aria-label={t('actionOverTable.importAria', { ciTypeName })}
                label={<IconLabel label={t('actionOverTable.import')} icon={ImportIcon} />}
                aria-controls={modalId}
                aria-haspopup={'dialog'}
            />
            <FileImport
                allowedFileTypes={['.xml', '.csv', '.xlsx']}
                multiple
                endpointUrl={fileImportURL}
                isOpen={modalImportOpen}
                close={onImportClose}
                fileImportStep={fileImportStep}
                setFileImportStep={setFileImportStep}
                ciType={ciType}
            />
        </>
    )
}
