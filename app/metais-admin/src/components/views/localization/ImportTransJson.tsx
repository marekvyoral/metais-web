import { BaseModal, Button, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportStepEnum, MutationFeedback } from '@isdd/metais-common/index'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusBar } from '@uppy/react'
import styles from '@isdd/metais-common/src/components/file-import/FileImport.module.scss'
import { UploadedUppyFile } from '@uppy/core'

type Props = {
    close: () => void
    onSuccess: (response: UploadedUppyFile<Record<string, unknown>, Record<string, unknown>>[] | undefined) => void
    isHardReset?: boolean
    method: 'POST' | 'PUT'
    endpointUrl: string
    fileFieldName: string
    disabled: boolean
}

export const ImportTransJson: React.FC<Props> = ({ onSuccess, close, endpointUrl, method, fileFieldName, isHardReset, disabled }) => {
    const { t } = useTranslation()
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.IMPORT)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    const { uppy, currentFiles, uploadFilesStatus, handleRemoveFile, handleUpload, generalErrorMessages, removeGeneralErrorMessages, cancelImport } =
        useUppy({
            maxFileSize: 20_971_520,
            multiple: false,
            endpointUrl,
            allowedFileTypes: ['.json'],
            setFileImportStep,
            fileImportStep,
            method,
            fieldName: fileFieldName,
        })

    const handleCancelImport = () => {
        cancelImport()
    }

    const onSubmit = async () => {
        const result = await handleUpload()
        if (result?.successful) {
            onSuccess(result.successful)
        }
    }

    return (
        <>
            <MutationFeedback success={uploadFilesStatus[0]?.response?.body?.ok === true ?? false} successMessage={t(`errors.import.successUload`)} />
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
                <Button
                    onClick={() => {
                        handleCancelImport()
                        close()
                    }}
                    label={t('fileImport.cancel')}
                    variant="secondary"
                />
                <Button
                    onClick={() => {
                        if (isHardReset) {
                            setIsConfirmModalOpen(true)
                        } else {
                            onSubmit()
                        }
                    }}
                    label={t('fileImport.import')}
                    disabled={currentFiles.length === 0 || disabled}
                />
            </div>
            <BaseModal widthInPx={600} isOpen={isConfirmModalOpen} close={() => setIsConfirmModalOpen(false)}>
                <TextHeading size="L">{t('localization.confirmHeading')}</TextHeading>
                <TextBody>{t('localization.confirmBody')}</TextBody>
                <div className={styles.centeredButtons}>
                    <Button
                        onClick={() => {
                            setIsConfirmModalOpen(false)
                        }}
                        label={t('fileImport.cancel')}
                        variant="secondary"
                    />
                    <Button
                        onClick={() => {
                            onSubmit()
                        }}
                        label={t('fileImport.import')}
                        variant="warning"
                    />
                </div>
            </BaseModal>
        </>
    )
}
