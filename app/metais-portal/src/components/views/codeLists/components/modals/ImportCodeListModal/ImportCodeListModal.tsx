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
    isRequest?: boolean
    isOpen: boolean
    onClose: () => void
}

const getEndpointPath = (isValidation: boolean, isRequest: boolean) => {
    if (isValidation) {
        return isRequest ? '/codelists/codelistheaders/upload/previewrequest' : '/codelists/codelistheaders/upload/preview'
    } else {
        return isRequest ? '/codelists/codelistheaders/uploadrequest' : '/codelists/codelistheaders/upload'
    }
}

export const ImportCodeListModal: React.FC<ImportCodeListModalProps> = ({ code, isRequest = false, isOpen, onClose }) => {
    const { t } = useTranslation()
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)

    const baseURL = import.meta.env.VITE_REST_CLIENT_CODELIST_REPO_TARGET_URL
    const endpointUrl = `${baseURL}${getEndpointPath(fileImportStep === FileImportStepEnum.VALIDATE, isRequest)}`

    const {
        uppy,
        currentFiles,
        uploadFilesStatus,
        handleRemoveFile,
        handleUpload,
        generalErrorMessages,
        removeGeneralErrorMessages,
        cancelImport,
        updateUploadFilesStatus,
        addGeneralErrorMessage,
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
        onClose()
    }

    const handleValidate = () => {
        uppy.setMeta({ code })

        try {
            uppy.upload().then((result) => {
                if (result.successful.length > 0) {
                    setFileImportStep(fileImportStep === FileImportStepEnum.IMPORT ? FileImportStepEnum.VALIDATE : FileImportStepEnum.IMPORT)
                }

                result.successful.forEach((item) => updateUploadFilesStatus(item, true))
                result.failed.forEach((item) => {
                    const errorMessage = item.response?.body.message ? `${item.name}: ${t(`errors.codeList.${item.response?.body.message}`)}` : ' '
                    updateUploadFilesStatus(item, false, errorMessage)
                })
            })
        } catch (error) {
            addGeneralErrorMessage(t('fileImport.uploadFailed'))
        }
    }

    return (
        <BaseModal isOpen={isOpen} close={onClose}>
            <div className={styles.headerWrapper}>
                <img src={ExportIcon} />
                <TextHeading size="L">{t('codeListDetail.modal.title.import')}</TextHeading>
            </div>

            <FileImportDragDrop uppy={uppy} />

            {generalErrorMessages.length > 0 && (
                <div className={styles.errorWrapper}>
                    <img src={CloseIcon} onClick={() => removeGeneralErrorMessages()} />
                    <ul>
                        {generalErrorMessages.map((error, index) => (
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
                <FileImportList
                    handleRemoveFile={handleRemoveFile}
                    fileList={currentFiles}
                    uploadFilesStatus={uploadFilesStatus}
                    generalErrorMessages={generalErrorMessages}
                    removeGeneralErrorMessages={removeGeneralErrorMessages}
                />
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
