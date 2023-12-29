import { Uppy, UppyFile } from '@uppy/core'
import '@uppy/core/dist/style.min.css'
import '@uppy/drag-drop/dist/style.min.css'
import en_US from '@uppy/locales/lib/en_US'
import sk_SK from '@uppy/locales/lib/sk_SK'
import '@uppy/status-bar/dist/style.min.css'
import XHRUpload from '@uppy/xhr-upload'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FileImportStepEnum } from '@isdd/metais-common/components/actions-over-table'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useCountdown } from '@isdd/metais-common/hooks/useCountdown'

interface iUseUppy {
    allowedFileTypes?: string[] // if undefined all file types are allowed
    maxFileSize?: number
    multiple: boolean
    endpointUrl?: string
    fileImportStep: FileImportStepEnum
    setFileImportStep: (value: FileImportStepEnum) => void
    setCustomFileMeta?: (file?: UppyFile<Record<string, unknown>, Record<string, unknown>>) => { [metaKey: string]: unknown }
    setFileUuidAsync?: (file?: UppyFile<Record<string, unknown>, Record<string, unknown>>) => Promise<{ uuid: string }>
}

export type UploadingFileState = {
    fileId: string
    fileName?: string
    uploadError?: string
    validationError?: string
    isUploaded: boolean
}

export type UploadingFilesStatus = UploadingFileState[]

const TIME_TO_HIDE_GENERAL_ERRORS_IN_SECONDS = 5

export const useUppy = ({
    maxFileSize = 20_971_520,
    allowedFileTypes,
    multiple,
    endpointUrl,
    setFileImportStep,
    setCustomFileMeta,
    setFileUuidAsync,
    fileImportStep,
}: iUseUppy) => {
    const { i18n, t } = useTranslation()
    const uppy = useMemo(() => {
        const uppyInstance = new Uppy({
            autoProceed: false,
            locale: i18n.language === 'sk' ? sk_SK : en_US,
        })
        uppyInstance.use(XHRUpload, {
            endpoint: '',
        })
        return uppyInstance
    }, [i18n.language])
    const {
        state: { token },
    } = useAuth()

    const [currentFiles, setCurrentFiles] = useState<UppyFile[]>([])
    const [generalErrorMessages, setGeneralErrorMessages] = useState<string[]>([])
    const [uploadFilesStatus, setUploadFilesStatus] = useState<UploadingFilesStatus>([])

    const removeGeneralErrorMessages = () => {
        setGeneralErrorMessages([])
        return
    }

    useCountdown({
        shouldCount: generalErrorMessages.length > 0,
        onCountDownEnd: removeGeneralErrorMessages,
        timeCountInSeconds: TIME_TO_HIDE_GENERAL_ERRORS_IN_SECONDS,
    })

    const containsFileId = useCallback(
        (fileId: string) => {
            return !!currentFiles.find((cf) => cf.id == fileId)
        },
        [currentFiles],
    )

    const updateUploadFilesStatus = useCallback(
        (file: UppyFile | undefined, isUploadedSuccessfully = false, errorString?: string) => {
            if (!file?.id || !containsFileId(file.id)) {
                errorString && setGeneralErrorMessages((prev) => [...prev, errorString])
                return
            }
            if (isUploadedSuccessfully) {
                setUploadFilesStatus((current) => [
                    ...current.filter((c) => c.fileId !== file?.id),
                    { fileId: file?.id ?? '', fileName: file?.name, uploadError: undefined, isUploaded: isUploadedSuccessfully },
                ])
                return
            }
            setUploadFilesStatus((current) => [
                ...current,
                { fileId: file?.id ?? '', fileName: file?.name, uploadError: errorString, isUploaded: isUploadedSuccessfully },
            ])
        },
        [containsFileId],
    )

    const filterUploadFilesStatusRecords = (fileIds: string[]) => {
        setUploadFilesStatus((prev) => prev.filter((x) => fileIds.includes(x.fileId)))
    }

    const clearUploadFilesStatus = () => {
        setUploadFilesStatus([])
    }

    const addGeneralErrorMessage = (errorMessage: string) => {
        setGeneralErrorMessages((prev) => [...prev, errorMessage])
        return
    }

    const resetProgressState = () => {
        uppy.resetProgress()
    }

    const changeFileImportStep = () => {
        switch (fileImportStep) {
            case FileImportStepEnum.VALIDATE:
                setFileImportStep(FileImportStepEnum.IMPORT)
                break
            case FileImportStepEnum.IMPORT:
                setFileImportStep(FileImportStepEnum.DONE)
                break

            default:
                FileImportStepEnum.IMPORT
        }
    }

    useEffect(() => {
        const language = i18n.language === 'sk' ? sk_SK : en_US

        uppy.setOptions({
            restrictions: {
                allowedFileTypes: allowedFileTypes,
                maxFileSize: maxFileSize,
                minNumberOfFiles: 1,
                maxNumberOfFiles: multiple ? null : 1,
            },
            locale: {
                strings: {
                    ...language.strings,
                    browse: '',
                    dropHereOr: '',
                },
            },
        })
    }, [allowedFileTypes, i18n.language, maxFileSize, multiple, uppy])

    useEffect(() => {
        uppy.getPlugin('XHRUpload')?.setOptions({
            endpoint: endpointUrl,
            headers: { Authorization: `Bearer ${token}`, 'Accept-Language': i18n.language },
        })
    }, [token, endpointUrl, i18n.language, uppy])

    useEffect(() => {
        const fileErrorCallback = (file: UppyFile | undefined, error: Error) => {
            updateUploadFilesStatus(file, false, error.message)
        }
        const fileAdded = async (file: UppyFile<Record<string, unknown>, Record<string, unknown>>) => {
            if (setCustomFileMeta) {
                uppy.setFileMeta(file?.id, setCustomFileMeta?.(file))
            }
            if (setFileUuidAsync) {
                const fileUuid = await setFileUuidAsync?.(file)
                uppy.setFileState(file.id, {
                    xhrUpload: {
                        endpoint: `${endpointUrl}${encodeURIComponent(fileUuid.uuid)}`,
                    },
                })
            }

            setCurrentFiles(() => uppy.getFiles())
            setFileImportStep(FileImportStepEnum.VALIDATE)
        }

        const fileRemoved = () => {
            const files = uppy.getFiles()
            setCurrentFiles(files)
            if (!files.length) {
                setFileImportStep(FileImportStepEnum.VALIDATE)
            }
            const remainingFileIds = files.map((x) => x.id)
            filterUploadFilesStatusRecords(remainingFileIds)
        }

        uppy.on('file-added', fileAdded)
        uppy.on('file-removed', fileRemoved)
        uppy.on('restriction-failed', fileErrorCallback)
        return () => {
            uppy.off('file-added', fileAdded)
            uppy.off('file-removed', fileRemoved)
            uppy.off('restriction-failed', fileErrorCallback)
        }
    }, [endpointUrl, setCustomFileMeta, setFileImportStep, setFileUuidAsync, updateUploadFilesStatus, uppy])

    const handleUpload = async () => {
        resetProgressState()
        uppy.getFiles().forEach((file) => {
            uppy.setFileState(file.id, {
                progress: { uploadComplete: false, uploadStarted: false },
            })
        })
        try {
            await uppy.upload().then((result) => {
                if (result.successful.length > 0) {
                    changeFileImportStep()
                }
                result.successful.forEach((item) => updateUploadFilesStatus(item, true))
                result.failed.forEach((item) => updateUploadFilesStatus(item, false, item.error))
            })
        } catch (error) {
            addGeneralErrorMessage(t('fileImport.uploadFailed'))
        }
    }

    const handleRemoveFile = (fileId: string) => {
        uppy.removeFile(fileId)
    }

    const cancelImport = () => {
        removeGeneralErrorMessages()
        setCurrentFiles([])
        clearUploadFilesStatus()
        resetProgressState()
        uppy.setState({ files: {} })
    }

    return {
        currentFiles,
        handleUpload,
        handleRemoveFile,
        cancelImport,
        uppy,
        generalErrorMessages,
        addGeneralErrorMessage,
        removeGeneralErrorMessages,
        uploadFilesStatus,
        updateUploadFilesStatus,
        resetProgressState,
    }
}
