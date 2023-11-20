import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportStepEnum } from '@isdd/metais-common/index'
import { useGetUuidHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { StatusBar } from '@uppy/react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextBody } from '@isdd/idsk-ui-kit/index'
import { FileImportList, ProgressInfoList } from '@isdd/metais-common/components/file-import/FileImportList'
import { CloseIcon, ErrorTriangleIcon } from '@isdd/metais-common/assets/images'
import { UppyFile } from '@uppy/core'

import styles from './FileUpload.module.scss'

export type FileUploadData = {
    fileId?: string
    fileName?: string
    fileSize?: number
    fileSizeString?: string
    fileType?: string
    uploadComplete?: boolean
    hasError?: boolean
}

interface IFileUpload {
    allowedFileTypes: string[]
    multiple: boolean
    endpointUrl?: string
    isUsingUuidInFilePath?: boolean
    maxFileSizeInBytes?: number
    onUploadSuccess?: (value: FileUploadData[]) => void
    onUploadingStart?: () => void
    onErrorOccurred?: (errorMessages: string[]) => void
}

export interface IFileUploadRef {
    startUploading: () => void
    cancelImport: () => void
    getFilesToUpload: () => FileUploadData[]
}

export const FileUpload = forwardRef<IFileUploadRef, IFileUpload>(
    (
        {
            allowedFileTypes,
            multiple,
            endpointUrl,
            isUsingUuidInFilePath,
            maxFileSizeInBytes = 20_971_520,
            onUploadingStart,
            onUploadSuccess,
            onErrorOccurred,
        },
        ref,
    ) => {
        const baseURL = import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL
        const fileUploadURL = endpointUrl ?? `${baseURL}${'/file/'}`
        const fileUuidsMapping = useRef<{ [fileId: string]: string }>({})
        const generateUuid = useGetUuidHook()
        const { uppy, setErrorMessages, currentFiles, uploadFileProgressInfo, handleRemoveFile, handleUpload, errorMessages, cancelImport } = useUppy(
            {
                maxFileSize: maxFileSizeInBytes,
                allowedFileTypes,
                multiple,
                endpointUrl: fileUploadURL,
                setFileImportStep: () => {
                    return
                },
                setFileUuidAsync: isUsingUuidInFilePath
                    ? async (file): Promise<{ uuid: string }> => {
                          const uuid = await generateUuid()
                          fileUuidsMapping.current[`${file?.id}`] = uuid
                          return { uuid }
                      }
                    : undefined,
                fileImportStep: FileImportStepEnum.IMPORT,
            },
        )

        const [isLoading, setIsLoading] = useState<boolean>(false)

        useEffect(() => {
            onErrorOccurred?.(errorMessages)
        }, [errorMessages, onErrorOccurred])

        const getUploadedFilesData = (currentFilesToUpload: UppyFile[], fileProgressInfo: ProgressInfoList[]) => {
            const uploadedFilesData: FileUploadData[] = fileProgressInfo.map((ufl) => {
                const currentFile = currentFilesToUpload.find((cf) => cf.id == ufl.id)
                return {
                    fileId: fileUuidsMapping.current[`${currentFile?.id}`],
                    fileName: currentFile?.name ?? '',
                    fileSize: currentFile?.size ?? 0,
                    fileSizeString: currentFile?.size.toString() ?? '',
                    fileType: currentFile?.type,
                    uploadComplete: currentFile?.progress?.uploadComplete,
                    hasError: ufl.error,
                }
            })
            return uploadedFilesData
        }

        const uploadSuccess = useCallback(
            (uploadedFilesData: FileUploadData[] | undefined) => {
                uploadedFilesData && onUploadSuccess?.(uploadedFilesData)
            },
            [onUploadSuccess],
        )

        useEffect(() => {
            if (isLoading) {
                const uploadedFilesData = getUploadedFilesData(currentFiles, uploadFileProgressInfo)
                uploadSuccess(uploadedFilesData)
                setIsLoading(false)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentFiles, uploadFileProgressInfo])

        useImperativeHandle(
            ref,
            () => {
                return {
                    startUploading() {
                        if (currentFiles.length > 0) {
                            setIsLoading(true)
                            onUploadingStart?.()
                            handleUpload()
                        }
                    },
                    cancelImport() {
                        cancelImport()
                    },
                    getFilesToUpload() {
                        return currentFiles.map<FileUploadData>((currentFile) => {
                            return {
                                fileName: currentFile?.name ?? '',
                                fileSize: currentFile?.size ?? 0,
                                fileSizeString: currentFile?.size.toString() ?? '',
                                fileType: currentFile?.type,
                                uploadComplete: currentFile?.progress?.uploadComplete,
                            }
                        })
                    },
                    getUploadedFiles() {
                        return uploadFileProgressInfo.map<FileUploadData>((ufl) => {
                            const currentFile = currentFiles.find((cf) => cf.id == ufl.id)
                            return {
                                fileId: currentFile?.id,
                                fileName: currentFile?.name ?? '',
                                fileSize: currentFile?.size ?? 0,
                                fileSizeString: currentFile?.size.toString() ?? '',
                                fileType: currentFile?.type,
                                uploadComplete: currentFile?.progress?.uploadComplete,
                                hasError: ufl.error,
                            }
                        })
                    },
                }
            },
            [cancelImport, currentFiles, handleUpload, onUploadingStart, uploadFileProgressInfo],
        )

        return (
            <>
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
                    <FileImportList handleRemoveFile={handleRemoveFile} fileList={currentFiles} progressInfoList={uploadFileProgressInfo} />
                </div>
            </>
        )
    },
)
