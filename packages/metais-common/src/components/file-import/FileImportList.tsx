import React from 'react'
import { UppyFile, Uppy } from '@uppy/core'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

import { formatBytes } from './fileImportUtils'
import styles from './FileImport.module.scss'

import { ErrorTriangleIcon, ImportDeleteIcon, RoundCheckGreenIcon } from '@isdd/metais-common/assets/images'

export interface ProgressInfoList {
    id: string
    error: boolean
}

interface IFileImportList {
    fileList: UppyFile[]
    uppy: Uppy
    handleRemoveFile: (fileId: string) => void
    progressInfoList: ProgressInfoList[]
}

export const FileImportList: React.FC<IFileImportList> = ({ fileList, handleRemoveFile, progressInfoList }) => {
    const hasUploadError = (file: UppyFile) => {
        return progressInfoList.find((item) => item.id === file.id)?.error
    }

    return (
        <ul className={styles.list}>
            {fileList.map((file) => (
                <li key={file.id}>
                    <div>
                        <TextBody size="S">{`${file.name} (${formatBytes(file.size)})`}</TextBody>
                        {hasUploadError(file) !== undefined &&
                            (hasUploadError(file) ? <img src={ErrorTriangleIcon} /> : <img src={RoundCheckGreenIcon} />)}
                    </div>

                    <img src={ImportDeleteIcon} onClick={() => handleRemoveFile(file.id)} />
                </li>
            ))}
        </ul>
    )
}
