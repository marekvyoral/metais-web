import { BaseModal, Button, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportStepEnum } from '@isdd/metais-common/index'
import { ExportIcon, CloseIcon, ErrorTriangleIcon } from '@isdd/metais-common/assets/images'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import { StatusBar } from '@uppy/react'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'

import styles from './importCodeListModal.module.scss'

export interface ImportCodeListModalProps {
    code: string
    isOpen: boolean
    onClose: () => void
}

export const ImportCodeListModal: React.FC<ImportCodeListModalProps> = ({ code, isOpen, onClose }) => {
    const { t } = useTranslation()
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)

    const baseURL = import.meta.env.VITE_REST_CLIENT_CODELIST_REPO_TARGET_URL
    const endpointUrl = `${baseURL}${
        fileImportStep === FileImportStepEnum.VALIDATE ? '/codelists/codelistheaders/upload/preview' : '/codelists/codelistheaders/upload'
    }`

    const {
        uppy,
        setUploadFileProgressInfo,
        setErrorMessages,
        currentFiles,
        uploadFileProgressInfo,
        handleRemoveFile,
        handleUpload,
        errorMessages,
        cancelImport,
    } = useUppy({
        maxFileSize: 20_971_520,
        allowedFileTypes: ['.xml', '.csv', '.xlsx'],
        multiple: false,
        endpointUrl,
        setFileImportStep,
        fileImportStep,
    })

    const handleCancelImport = () => {
        cancelImport()
        close()
    }

    const handleValidate = () => {
        uppy.setMeta({ code })

        try {
            uppy.upload().then((result) => {
                if (result.successful.length > 0) {
                    setFileImportStep(fileImportStep === FileImportStepEnum.IMPORT ? FileImportStepEnum.VALIDATE : FileImportStepEnum.IMPORT)
                }

                const successfulFilesInfo = result.successful.map((item) => ({
                    id: item.id,
                    error: false,
                }))
                const failedFilesInfo = result.failed.map((item) => ({
                    id: item.id,
                    error: true,
                }))

                result.failed.forEach((item) => {
                    if (item.response?.body.message) {
                        setErrorMessages((prev) => [...prev, `${item.name}: ${t(`errors.codeList.${item.response?.body.message}`)}`])
                    }
                })

                const updatedFileIds = [...successfulFilesInfo.map((x) => x.id), ...failedFilesInfo.map((x) => x.id)]
                setUploadFileProgressInfo((prev) => {
                    const notUpdated = prev.filter((x) => !updatedFileIds.includes(x.id))
                    return [...notUpdated, ...successfulFilesInfo, ...failedFilesInfo]
                })
            })
        } catch (error) {
            setErrorMessages((prev) => [...prev, t('fileImport.uploadFailed')])
        }
    }

    if (!code) return <></>

    return (
        <BaseModal isOpen={isOpen} close={onClose}>
            <div className={styles.headerWrapper}>
                <img src={ExportIcon} />
                <TextHeading size="L">{t('codeListDetail.modal.title.import')}</TextHeading>
            </div>

            <FileImportDragDrop uppy={uppy} />

            {errorMessages.length > 0 && (
                <div className={styles.errorWrapper}>
                    <img src={CloseIcon} onClick={() => setErrorMessages([])} />
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index} className={styles.errorMessages}>
                                <img src={ErrorTriangleIcon} />
                                <TextBody size="S" className={styles.textError}>
                                    {error}
                                </TextBody>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <StatusBar
                    className={styles.statusBar}
                    uppy={uppy}
                    hideAfterFinish={false}
                    hideCancelButton
                    hidePauseResumeButton
                    hideRetryButton
                    hideUploadButton
                />
                <FileImportList uppy={uppy} handleRemoveFile={handleRemoveFile} fileList={currentFiles} progressInfoList={uploadFileProgressInfo} />
            </div>

            <div className={styles.centeredButtons}>
                <Button onClick={handleCancelImport} label={t('fileImport.cancel')} variant="secondary" />
                <Button
                    onClick={fileImportStep === FileImportStepEnum.VALIDATE ? handleValidate : handleUpload}
                    label={fileImportStep === FileImportStepEnum.VALIDATE ? t('fileImport.validate') : t('fileImport.import')}
                    disabled={currentFiles.length === 0}
                />
            </div>
        </BaseModal>
    )
}
