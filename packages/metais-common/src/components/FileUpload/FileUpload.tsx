import { StatusBar } from '@uppy/react'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { UppyFile } from '@uppy/core'
import { v4 as uuidV4 } from 'uuid'

import styles from './FileUpload.module.scss'

import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import { UploadingFilesStatus, useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportStepEnum } from '@isdd/metais-common/index'
import { useGetUuidHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'
import { RefAttributesRefType } from '@isdd/metais-common/api/generated/dms-swagger'
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
    fileMetaAttributes?: Record<string, unknown>
    onUploadSuccess?: (value: FileUploadData[]) => void
    onFileUploadFailed?: () => void
    onUploadingStart?: () => void
    onErrorOccurred?: (errorMessages: string[]) => void
    setCurrentFiles?: React.Dispatch<React.SetStateAction<UppyFile[] | undefined>>
    customUuid?: string
    refId?: string
    refType: RefAttributesRefType
    textSize?: 'S' | 'L'
}

export interface IFileUploadRef {
    startUploading: () => void
    setCustomMeta: (fileNewMetaAttributes: { 'x-content-uuid': string; refAttributes: Blob }) => void
    cancelImport: () => void
    getFilesToUpload: () => FileUploadData[]
    fileUuidsMapping: () => React.MutableRefObject<{
        [fileId: string]: string
    }>
    getUploadedFiles: () => FileUploadData[]
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
            customUuid,
            refId,
            refType,
            onFileUploadFailed,
            textSize,
        },
        ref,
    ) => {
        const baseURL = import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL
        const fileUploadURL = endpointUrl ?? isUsingUuidInFilePath ? `${baseURL}${'/file/'}` : `${baseURL}${'/file'}`
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
            fileUploadError: (err) => {
                return err.responseText
            },
            setFileImportStep: () => {
                return
            },
            setCustomFileMeta: (file) => {
                const metaAttrs = { ...fileMetaAttributes }
                if (!isUsingUuidInFilePath) {
                    const id = uuidV4()
                    metaAttrs['x-content-uuid'] = id
                    fileUuidsMapping.current[`${file?.id}`] = id
                }

                return metaAttrs
            },
            setFileUuidAsync: isUsingUuidInFilePath
                ? async (file): Promise<{ uuid: string }> => {
                      const uuid = customUuid ?? (await generateUuid())
                      fileUuidsMapping.current[`${file?.id}`] = uuid
                      return { uuid }
                  }
                : undefined,
            fileImportStep: FileImportStepEnum.IMPORT,
            refId: refId,
            refType: refType,
        })

        const getNewMeta = useCallback(
            (fileNewMetaAttributes: Record<string, unknown>, file?: UppyFile<Record<string, unknown>, Record<string, unknown>>) => {
                const metaAttrs = { ...fileNewMetaAttributes }
                if (!isUsingUuidInFilePath) {
                    const id = uuidV4()
                    metaAttrs['x-content-uuid'] = id
                    fileUuidsMapping.current[`${file?.id}`] = id
                }
                return metaAttrs
            },
            [isUsingUuidInFilePath],
        )

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
                    uploadComplete: ufs.isUploaded,
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
                if (uploadedFilesData.every((f) => f.uploadComplete)) {
                    uploadSuccess(uploadedFilesData)
                } else {
                    onFileUploadFailed && onFileUploadFailed()
                }
                setIsLoading(false)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentFiles, uploadFilesStatus])

        useImperativeHandle(
            ref,
            () => {
                return {
                    setCustomMeta(fileNewMetaAttributes: { 'x-content-uuid': string; refAttributes: Blob }) {
                        currentFiles.forEach((file) => uppy.setFileMeta(file.id, getNewMeta(fileNewMetaAttributes, file)))
                    },
                    fileUuidsMapping() {
                        return fileUuidsMapping
                    },
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
            [cancelImport, currentFiles, getNewMeta, handleUpload, onUploadingStart, uploadFilesStatus, uppy],
        )

        const handleRemoveFileAndUuid = (fileId: string) => {
            handleRemoveFile(fileId)
            delete fileUuidsMapping.current[fileId]
        }

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
                        textSize={textSize}
                        handleRemoveFile={handleRemoveFileAndUuid}
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
