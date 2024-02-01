import { BaseModal, Button, ButtonGroupRow, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportStepEnum, MutationFeedback } from '@isdd/metais-common/index'
import StatusBar from '@uppy/react/src/StatusBar'
import React, { useState } from 'react'
import stylesImport from '@isdd/metais-common/components/file-import/FileImport.module.scss'
import { useTranslation } from 'react-i18next'

import styles from './integration-link/integration.module.scss'

type Props = {
    entityId: string
    entityName: string
    metaisCode: string
    isOpen: boolean
    onClose: () => void
    ownerGid: string
    onUploadSuccess: () => void
    header: string
}

export const ProvIntegrationUploadDocModal: React.FC<Props> = ({
    entityId,
    entityName,
    isOpen,
    onClose,
    metaisCode,
    ownerGid,
    onUploadSuccess,
    header,
}) => {
    const { t } = useTranslation()
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.IMPORT)

    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const { uppy, currentFiles, handleRemoveFile, uploadFilesStatus, handleUpload, removeGeneralErrorMessages, generalErrorMessages, cancelImport } =
        useUppy({
            multiple: false,
            fileImportStep,
            endpointUrl: `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/${entityId}`,
            setFileImportStep,
            setCustomFileMeta: () => {
                return {
                    refAttributes: new Blob(
                        [
                            JSON.stringify({
                                refType: 'CI',
                                refCiTechnicalName: entityName,
                                refCiId: entityId,
                                refCiMetaisCode: metaisCode,
                                refCiOwner: ownerGid,
                            }),
                        ],
                        { type: 'application/json' },
                    ),
                }
            },
        })

    const onSubmit = async () => {
        setIsSuccess(false)
        setIsError(false)
        if (currentFiles?.length > 0) {
            const result = await handleUpload()
            if (result?.successful[0].progress?.uploadComplete) {
                setIsSuccess(true)
                onUploadSuccess()
            } else {
                setIsError(true)
            }
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            close={() => {
                onClose()
                cancelImport()
            }}
        >
            <MutationFeedback error={isError} success={isSuccess} successMessage={t('upload.success')} />
            <TextHeading size="M">{header}</TextHeading>
            <FileImportDragDrop uppy={uppy} />
            <div>
                <StatusBar
                    className={stylesImport.statusBar}
                    uppy={uppy}
                    hideAfterFinish={false}
                    hideCancelButton
                    hidePauseResumeButton
                    hideRetryButton
                    hideUploadButton
                />
                <FileImportList
                    handleRemoveFile={handleRemoveFile}
                    removeGeneralErrorMessages={removeGeneralErrorMessages}
                    generalErrorMessages={generalErrorMessages}
                    fileList={currentFiles}
                    uploadFilesStatus={uploadFilesStatus}
                />
            </div>
            <ButtonGroupRow className={styles.justifyEnd}>
                <Button label={t('button.saveChanges')} onClick={() => onSubmit()} />
                <Button
                    variant="secondary"
                    label={t('button.cancel')}
                    onClick={() => {
                        onClose()
                        cancelImport()
                    }}
                />
            </ButtonGroupRow>
        </BaseModal>
    )
}
