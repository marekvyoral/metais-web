import { BaseModal, Button, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportStepEnum } from '@isdd/metais-common/index'
import { ExportIcon } from '@isdd/metais-common/assets/images'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import { StatusBar } from '@uppy/react'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'
import { useNavigate } from 'react-router-dom'
import { useInvalidateCodeListCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import styles from './importCodeListModal.module.scss'

import { IsSuccessActions } from '@/components/views/codeLists/CodeListDetailWrapper'

export interface ImportCodeListModalProps {
    code: string
    id: number
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

export const ImportCodeListModal: React.FC<ImportCodeListModalProps> = ({ code, id, isRequest = false, isOpen, onClose }) => {
    const { t } = useTranslation()
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)
    const navigate = useNavigate()
    const { invalidate } = useInvalidateCodeListCache()
    const { setIsActionSuccess } = useActionSuccess()

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
                    const errorMessage = `${item.name}: ${t([
                        `errors.codeList.${item.response?.body.message}`,
                        'errors.codeList.uploadValidationFallbackError',
                    ])}`

                    updateUploadFilesStatus(item, false, errorMessage)
                })
            })
        } catch (error) {
            addGeneralErrorMessage(t('feedback.mutationErrorMessage'))
        }
    }

    const processUpload = () => {
        handleUpload().then((response) => {
            const body = response?.successful.find((item) => item.response?.body)?.response?.body
            invalidate(code, id)
            if (body?.newId) {
                const path = `${isRequest ? NavigationSubRoutes.REQUESTLIST : NavigationSubRoutes.CODELIST}/${body?.newId}`
                setIsActionSuccess({ value: true, path, additionalInfo: { action: IsSuccessActions.IMPORT } })
                navigate(path)
            }
        })
    }

    return (
        <BaseModal isOpen={isOpen} close={onClose}>
            <div className={styles.headerWrapper}>
                <img src={ExportIcon} />
                <TextHeading size="L">{t('codeListDetail.modal.title.import')}</TextHeading>
            </div>

            <FileImportDragDrop uppy={uppy} hideNoSelectedFileToImport={currentFiles.length > 0} />

            <div>
                {fileImportStep === FileImportStepEnum.DONE && (
                    <div className={styles.centeredButtons}>
                        <TextBody size="L" className={styles.greenBoldText}>
                            {t('fileImport.done')}
                        </TextBody>
                    </div>
                )}
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
                    onClick={fileImportStep === FileImportStepEnum.VALIDATE ? handleValidate : processUpload}
                    label={fileImportStep === FileImportStepEnum.VALIDATE ? t('fileImport.validate') : t('fileImport.import')}
                    disabled={currentFiles.length === 0}
                />
            </div>
        </BaseModal>
    )
}
