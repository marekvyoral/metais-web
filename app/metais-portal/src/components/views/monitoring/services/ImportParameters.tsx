import { FileImportStepEnum, MutationFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'
import { StatusBar } from '@uppy/react'
import styles from '@isdd/metais-common/src/components/file-import/FileImport.module.scss'

import { MainContentWrapper } from '@/components/MainContentWrapper'

interface IImportParametersView {
    isLoading?: boolean
}

const getEndpointPath = (isValidation: boolean) => {
    if (isValidation) {
        return '/param-value/v2/validateReport'
    } else {
        return '/param-value/v2/importReport'
    }
}

export const ImportParametersView: React.FC<IImportParametersView> = () => {
    const { t } = useTranslation()
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)

    const baseURL = import.meta.env.VITE_REST_CLIENT_MONITORING_TARGET_URL
    const endpointUrl = `${baseURL}${getEndpointPath(fileImportStep === FileImportStepEnum.VALIDATE)}`

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
        multiple: false,
        endpointUrl,
        setFileImportStep,
        fileImportStep,
    })

    const handleCancelImport = () => {
        cancelImport()
    }

    const handleValidate = () => {
        try {
            uppy.upload().then((result) => {
                if (result.successful.length > 0) {
                    if (result.successful[0].response?.body?.ok) {
                        setFileImportStep(fileImportStep === FileImportStepEnum.IMPORT ? FileImportStepEnum.VALIDATE : FileImportStepEnum.IMPORT)
                        result.successful.forEach((item) => updateUploadFilesStatus(item, true))
                    } else {
                        Array.isArray(result?.successful[0]?.response?.body?.errMessages) &&
                            result?.successful[0]?.response?.body?.errMessages?.forEach((item) => {
                                const errorMessage = item.type
                                    ? `${result?.successful[0]?.name} - ${t(`errors.import.validateFile`)} line: ${item.line} error type: ${
                                          item.type
                                      } value: ${item.value}`
                                    : `${item.name}: ${t('errors.import.validateFile')}`
                                updateUploadFilesStatus(item, false, errorMessage)
                            })
                    }
                } else {
                    result.failed.forEach((item) => {
                        const errorMessage = item.response?.body.message
                            ? `${item.name}: ${t(`errors.import.uploadFile`)} - ${item.response?.body.message}`
                            : `${item.name}: ${t('errors.import.uploadFile')}`
                        updateUploadFilesStatus(item, false, errorMessage)
                    })
                }
            })
        } catch (error) {
            addGeneralErrorMessage(t('fileImport.uploadFailed'))
        }
    }

    return (
        <MainContentWrapper>
            <TextHeading size="XL">{t('navMenu.lists.monitoringImport')}</TextHeading>
            <MutationFeedback
                success={uploadFilesStatus[0]?.response?.body?.ok === true ?? false}
                error={false}
                successMessage={t(`errors.import.successUload`)}
            />
            <FileImportDragDrop uppy={uppy} />
            <div>
                <StatusBar
                    className={styles.statusBar}
                    uppy={uppy}
                    hideAfterFinish={false}
                    showProgressDetails
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
        </MainContentWrapper>
    )
}
