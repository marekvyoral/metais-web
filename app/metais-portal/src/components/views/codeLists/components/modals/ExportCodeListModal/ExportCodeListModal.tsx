import React, { useState } from 'react'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { useTranslation } from 'react-i18next'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { ExportIcon } from '@isdd/metais-common/assets/images'
import { LoadingIndicator } from '@isdd/idsk-ui-kit/loading-indicator/LoadingIndicator'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { useDownloadInternalCodelistHook, useDownloadInternalCodelistRequestHook } from '@isdd/metais-common/api/generated/codelist-repo-swagger'

import styles from './exportCodeListModal.module.scss'

interface ExportCodeListModalProps {
    code: string
    isOpen: boolean
    isRequest?: boolean
    onClose: () => void
}

export enum CodeListExportExtensionEnum {
    XML = 'XML',
    CSV = 'CSV',
    XLSX = 'XLSX',
}

const generateExportFileName = (code: string, extension: CodeListExportExtensionEnum) => {
    return `${code}.${extension.toLocaleLowerCase()}`
}

export const ExportCodeListModal: React.FC<ExportCodeListModalProps> = ({ code, isOpen, onClose, isRequest }) => {
    const { t } = useTranslation()
    const [isLoading, setLoading] = useState<boolean>(false)

    const downloadFunction = useDownloadInternalCodelistHook()
    const downloadRequestFunction = useDownloadInternalCodelistRequestHook()

    if (!code) return <></>

    const exportAndDownloadBlob = async (extension: CodeListExportExtensionEnum) => {
        const blobData = !isRequest ? await downloadFunction(code) : await downloadRequestFunction(code)

        downloadBlobAsFile(new Blob([blobData]), generateExportFileName(code, extension), false)
        setLoading(false)
    }

    const startExport = (extension: CodeListExportExtensionEnum) => {
        setLoading(true)
        exportAndDownloadBlob(extension)
        onClose()
    }

    return (
        <BaseModal isOpen={isOpen} close={onClose}>
            {isLoading && <LoadingIndicator label={t('exportItemsOrRelations.loading')} />}

            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <img className={styles.iconWidth} src={ExportIcon} alt="export-icon" />
                    </div>
                    <TextHeading size={'L'} className={styles.heading}>
                        {t('codeListDetail.modal.title.export')}
                    </TextHeading>
                    <div className={styles.buttonGroup}>
                        <Button
                            label={t('codeListDetail.modal.button.xml')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport(CodeListExportExtensionEnum.XML)}
                        />
                        <Button
                            label={t('codeListDetail.modal.button.csv')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport(CodeListExportExtensionEnum.CSV)}
                        />
                        <Button
                            label={t('codeListDetail.modal.button.xlsx')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport(CodeListExportExtensionEnum.XLSX)}
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}
