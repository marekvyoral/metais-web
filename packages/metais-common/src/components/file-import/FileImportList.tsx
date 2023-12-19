import React from 'react'
import { UppyFile } from '@uppy/core'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

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
}

export const FileImportList: React.FC<IFileImportList> = ({
    fileList,
    handleRemoveFile,
    removeGeneralErrorMessages,
    uploadFilesStatus,
    generalErrorMessages,
}) => {
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
                                <img src={ErrorTriangleIcon} />
                                <TextBody size="S" className={styles.textError}>
                                    {generalError}
                                </TextBody>
                            </li>
                        ))}
                    </ul>
                </div>
                {generalErrorMessages.length > 0 && <img src={CloseIcon} onClick={() => removeGeneralErrorMessages()} />}
            </div>

            <ul className={styles.list}>
                {fileList.map((file) => (
                    <li key={file.id}>
                        <div className={styles.fileInfoWrapper}>
                            <div className={styles.fileErrorWrapper}>
                                <TextBody size="S">{uploadFilesStatus.find((ufs) => ufs.fileId == file.id)?.uploadError}</TextBody>
                            </div>
                            <TextBody size="S">{`${file.name} (${formatBytes(file.size)})`}</TextBody>
                        </div>
                        <div>
                            {hasError(file) && <img src={ErrorTriangleIcon} />}
                            {isUploaded(file) && <img src={RoundCheckGreenIcon} />}
                            <img
                                src={ImportDeleteIcon}
                                onClick={() => {
                                    handleRemoveFile(file.id)
                                    removeGeneralErrorMessages()
                                }}
                                className={styles.clickable}
                                hidden={isUploaded(file)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
