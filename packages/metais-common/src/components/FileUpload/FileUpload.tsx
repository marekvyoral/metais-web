import { StatusBar } from '@uppy/react'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { UppyFile } from '@uppy/core'

import styles from './FileUpload.module.scss'

import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import { UploadingFilesStatus, useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportStepEnum } from '@isdd/metais-common/index'
import { useGetUuidHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'

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
    fileMetaAttributes: Record<string, unknown>
    onUploadSuccess?: (value: FileUploadData[]) => void
    onUploadingStart?: () => void
    onErrorOccurred?: (errorMessages: string[]) => void
    setCurrentFiles?: React.Dispatch<React.SetStateAction<UppyFile[] | undefined>>
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
            fileMetaAttributes,
            onUploadingStart,
            onUploadSuccess,
            onErrorOccurred,
            setCurrentFiles,
        },
        ref,
    ) => {
        const baseURL = import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL
        const fileUploadURL = endpointUrl ?? `${baseURL}${'/file/'}`
        const fileUuidsMapping = useRef<{ [fileId: string]: string }>({})
        const generateUuid = useGetUuidHook()
        const {
            uppy,
            removeGeneralErrorMessages,
            currentFiles,
            uploadFilesStatus,
            handleRemoveFile,
            handleUpload,
            generalErrorMessages,
            cancelImport,
        } = useUppy({
            maxFileSize: maxFileSizeInBytes,
            allowedFileTypes,
            multiple,
            endpointUrl: fileUploadURL,
            setFileImportStep: () => {
                return
            },
            setCustomFileMeta: () => {
                return {
                    ...fileMetaAttributes,
                }
            },
            setFileUuidAsync: isUsingUuidInFilePath
                ? async (file): Promise<{ uuid: string }> => {
                      const uuid = await generateUuid()
                      fileUuidsMapping.current[`${file?.id}`] = uuid
                      return { uuid }
                  }
                : undefined,
            fileImportStep: FileImportStepEnum.IMPORT,
        })

        const [isLoading, setIsLoading] = useState<boolean>(false)

        useEffect(
            () => () => {
                cancelImport()
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [],
        )

        useEffect(() => {
            onErrorOccurred?.(generalErrorMessages)
        }, [generalErrorMessages, onErrorOccurred])

        const getUploadedFilesData = (currentFilesToUpload: UppyFile[], uploadingFilesStatus: UploadingFilesStatus) => {
            const uploadedFilesData: FileUploadData[] = uploadingFilesStatus.map((ufs) => {
                const currentFile = currentFilesToUpload.find((cf) => cf.id == ufs.fileId)
                return {
                    fileId: fileUuidsMapping.current[`${currentFile?.id}`],
                    fileName: currentFile?.name ?? '',
                    fileSize: currentFile?.size ?? 0,
                    fileSizeString: currentFile?.size.toString() ?? '',
                    fileType: currentFile?.type,
                    uploadComplete: currentFile?.progress?.uploadComplete,
                    hasError: !!ufs.uploadError,
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
            setCurrentFiles && setCurrentFiles(currentFiles)
        }, [currentFiles, setCurrentFiles])

        useEffect(() => {
            if (isLoading) {
                const uploadedFilesData = getUploadedFilesData(currentFiles, uploadFilesStatus)
                uploadSuccess(uploadedFilesData)
                setIsLoading(false)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentFiles, uploadFilesStatus])

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
                        return uploadFilesStatus.map<FileUploadData>((ufs) => {
                            const currentFile = currentFiles.find((cf) => cf.id == ufs.fileId)
                            return {
                                fileId: currentFile?.id,
                                fileName: currentFile?.name ?? '',
                                fileSize: currentFile?.size ?? 0,
                                fileSizeString: currentFile?.size.toString() ?? '',
                                fileType: currentFile?.type,
                                uploadComplete: currentFile?.progress?.uploadComplete,
                                hasError: !!ufs.uploadError,
                            }
                        })
                    },
                }
            },
            [cancelImport, currentFiles, handleUpload, onUploadingStart, uploadFilesStatus],
        )

        return (
            <>
                <FileImportDragDrop uppy={uppy} hideNoSelectedFileToImport={currentFiles.length > 0} />
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
                        removeGeneralErrorMessages={removeGeneralErrorMessages}
                        fileList={currentFiles}
                        uploadFilesStatus={uploadFilesStatus}
                        generalErrorMessages={generalErrorMessages}
                    />
                </div>
            </>
        )
    },
)
