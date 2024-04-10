import React from 'react'
import { UppyFile } from '@uppy/core'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { TransparentButtonWrapper } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'

import { formatBytes } from './fileImportUtils'
import styles from './FileImport.module.scss'

import { CloseIcon, ErrorTriangleIcon, ImportDeleteIcon, RoundCheckGreenIcon } from '@isdd/metais-common/assets/images'
import { UploadingFilesStatus } from '@isdd/metais-common/hooks/useUppy'

export interface ProgressInfoList {
    id: string
    error: boolean
}

interface IFileImportList {
    fileList: UppyFile[]
    handleRemoveFile: (fileId: string) => void
    removeGeneralErrorMessages: () => void
    uploadFilesStatus: UploadingFilesStatus
    generalErrorMessages: string[]
    textSize?: 'S' | 'L'
}

export const FileImportList: React.FC<IFileImportList> = ({
    fileList,
    handleRemoveFile,
    removeGeneralErrorMessages,
    uploadFilesStatus,
    generalErrorMessages,
    textSize,
}) => {
    const { t } = useTranslation()
    const hasError = (file: UppyFile) => {
        const error = uploadFilesStatus.find((item) => item.fileId == file.id)?.uploadError
        return error ? error.length > 0 : false
    }
    const isUploaded = (file: UppyFile) => {
        const uploaded = uploadFilesStatus.find((item) => item.fileId == file.id)?.isUploaded
        return !!uploaded
    }
    return (
        <>
            <div className={styles.generalErrorWrapper}>
                <div className={styles.errorWrapper}>
                    <ul>
                        {generalErrorMessages.map((generalError, index) => (
                            <li key={index} className={styles.errorMessages}>
                                <img src={ErrorTriangleIcon} alt="" />
                                <TextBody size="S" className={styles.textError}>
                                    {generalError}
                                </TextBody>
                            </li>
                        ))}
                    </ul>
                </div>
                {generalErrorMessages.length > 0 && (
                    <TransparentButtonWrapper onClick={() => removeGeneralErrorMessages()}>
                        <img src={CloseIcon} alt={t('close')} />
                    </TransparentButtonWrapper>
                )}
            </div>

            <ul className={styles.list}>
                {fileList.map((file) => (
                    <li key={file.id}>
                        <div className={styles.fileInfoWrapper}>
                            <div className={styles.fileErrorWrapper}>
                                <TextBody size="S">{uploadFilesStatus.find((ufs) => ufs.fileId == file.id)?.uploadError}</TextBody>
                            </div>
                            <TextBody size={textSize ?? 'S'}>{`${file.name} (${formatBytes(file.size)})`}</TextBody>
                        </div>
                        <div>
                            {hasError(file) && <img src={ErrorTriangleIcon} alt={t('upload.itemError', { itemName: file.name })} />}
                            {isUploaded(file) && <img src={RoundCheckGreenIcon} alt={t('upload.itemSuccess', { itemName: file.name })} />}
                            <TransparentButtonWrapper
                                onClick={() => {
                                    handleRemoveFile(file.id)
                                    removeGeneralErrorMessages()
                                }}
                                aria-label={t('upload.deleteItem', { itemName: file.name })}
                            >
                                <img src={ImportDeleteIcon} className={styles.clickable} hidden={isUploaded(file)} alt="" />
                            </TransparentButtonWrapper>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
