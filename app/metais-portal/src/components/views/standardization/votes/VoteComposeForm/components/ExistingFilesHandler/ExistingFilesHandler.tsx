import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { TextBody, TransparentButtonWrapper } from '@isdd/idsk-ui-kit/index'
import { ImportDeleteIcon } from '@isdd/metais-common/assets/images'
import { useDeleteContent } from '@isdd/metais-common/api/generated/dms-swagger'
import { formatBytes } from '@isdd/metais-common/components/file-import/fileImportUtils'

import styles from './ExistingFilesHandler.module.scss'

export type ExistingFileData = {
    fileId?: string
    fileName?: string
    fileSize?: number
    fileType?: string
}

interface IExistingFilesHandler {
    existingFiles: ExistingFileData[]
    onFilesProcessingSuccess?: () => void
    onFilesProcessingStart?: () => void
    onErrorOccurred?: (errorMessages: string) => void
}

export interface IExistingFilesHandlerRef {
    startFilesProcessing: () => void
    getProcessedFiles: () => ExistingFileData[]
    getRemainingFileList: () => ExistingFileData[]
    hasDataToProcess: () => boolean
}

export const ExistingFilesHandler = forwardRef<IExistingFilesHandlerRef, IExistingFilesHandler>(
    ({ existingFiles, onFilesProcessingStart, onFilesProcessingSuccess, onErrorOccurred }, ref) => {
        const [fileList, setFileList] = useState<ExistingFileData[]>(existingFiles)
        const [filesToProcessList, setFilesToProcessList] = useState<string[]>([])
        const { mutateAsync: deleteFilesMutationAsync, isError: isDeleteFilesError, error: deleteFilesError } = useDeleteContent()

        const callDeleteFileApi = useCallback(
            async (fileUuids: string[]) => {
                try {
                    Promise.all(fileUuids.map(async (fileUuid) => await deleteFilesMutationAsync({ uuid: fileUuid ?? '' })))
                    onFilesProcessingSuccess?.()
                } catch {
                    onErrorOccurred?.(deleteFilesError?.message ?? '')
                }
            },
            [deleteFilesError?.message, deleteFilesMutationAsync, onErrorOccurred, onFilesProcessingSuccess],
        )

        useEffect(() => {
            if (isDeleteFilesError) {
                onErrorOccurred?.(deleteFilesError?.message ?? '')
            }
        }, [deleteFilesError?.message, isDeleteFilesError, onErrorOccurred])

        useImperativeHandle(
            ref,
            () => {
                return {
                    startFilesProcessing() {
                        if (filesToProcessList.length > 0) {
                            onFilesProcessingStart?.()
                            callDeleteFileApi(filesToProcessList)
                        }
                    },

                    hasDataToProcess() {
                        return filesToProcessList.length > 0
                    },

                    getProcessedFiles() {
                        return existingFiles.map<ExistingFileData>((ef) => {
                            return filesToProcessList.find((ftp) => ftp == ef.fileId) ?? {}
                        })
                    },

                    getRemainingFileList() {
                        return fileList
                    },
                }
            },
            [callDeleteFileApi, existingFiles, fileList, filesToProcessList, onFilesProcessingStart],
        )

        const handleRemoveFileFromList = async (fileToRemoveUuid: string | undefined) => {
            setFileList((current) => current.filter((file) => file.fileId !== fileToRemoveUuid))
            const fileToRemoveFromList = existingFiles.find((file) => file?.fileId == fileToRemoveUuid ?? '')
            if (fileToRemoveFromList?.fileId) {
                setFilesToProcessList(filesToProcessList.concat(fileToRemoveFromList.fileId))
            }
        }

        return (
            <ul className={styles.list}>
                {fileList.map((file) => (
                    <li key={file.fileId}>
                        <div>
                            <TextBody size="S">{`${file.fileName} (${formatBytes(file.fileSize ?? 0)})`}</TextBody>
                        </div>
                        <TransparentButtonWrapper onClick={() => handleRemoveFileFromList(file.fileId)}>
                            <img src={ImportDeleteIcon} />
                        </TransparentButtonWrapper>
                    </li>
                ))}
            </ul>
        )
    },
)
