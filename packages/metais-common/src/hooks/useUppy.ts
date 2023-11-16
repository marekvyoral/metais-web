import { UppyFile, Uppy } from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import '@uppy/core/dist/style.min.css'
import '@uppy/drag-drop/dist/style.min.css'
import '@uppy/status-bar/dist/style.min.css'
import { useTranslation } from 'react-i18next'
import sk_SK from '@uppy/locales/lib/sk_SK'
import en_US from '@uppy/locales/lib/en_US'
import { useEffect, useState } from 'react'

import { FileImportStepEnum } from '@isdd/metais-common/components/actions-over-table'
import { ProgressInfoList } from '@isdd/metais-common/components/file-import/FileImportList'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

const uppy = new Uppy({
    autoProceed: false,
})

uppy.use(XHRUpload, {
    endpoint: '',
})

interface iUseUppy {
    allowedFileTypes?: string[] // if undefined all file types are allowed
    maxFileSize?: number
    multiple: boolean
    endpointUrl?: string
    fileImportStep: FileImportStepEnum
    setFileImportStep: (value: FileImportStepEnum) => void
    setCustomFileMeta?: (file?: UppyFile<Record<string, unknown>, Record<string, unknown>>) => { [metaKey: string]: string | number }
    setFileUuidAsync?: (file?: UppyFile<Record<string, unknown>, Record<string, unknown>>) => Promise<{ uuid: string }>
}

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
    const {
        state: { token },
    } = useAuth()
    const { i18n, t } = useTranslation()
    const [currentFiles, setCurrentFiles] = useState<UppyFile[]>([])
    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [uploadFileProgressInfo, setUploadFileProgressInfo] = useState<ProgressInfoList[]>([])

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
    }, [allowedFileTypes, i18n.language, maxFileSize, multiple])

    useEffect(() => {
        uppy.getPlugin('XHRUpload')?.setOptions({
            endpoint: endpointUrl,
            headers: { Authorization: `Bearer ${token}` },
        })
    }, [token, endpointUrl])

    useEffect(() => {
        const fileErrorCallback = (_file: UppyFile | undefined, error: Error) => {
            setErrorMessages((prev) => [...prev, error.message])
        }
        const fileAdded = async (file: UppyFile<Record<string, unknown>, Record<string, unknown>>) => {
            if (setCustomFileMeta) uppy.setFileMeta(file?.id, setCustomFileMeta?.(file))

            if (setFileUuidAsync) {
                const fileUuid = await setFileUuidAsync?.(file)
                uppy.setFileMeta(file.id, { uuid: fileUuid.uuid })
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
            setUploadFileProgressInfo((prev) => prev.filter((x) => remainingFileIds.includes(x.id)))
        }

        uppy.on('file-added', fileAdded)
        uppy.on('file-removed', fileRemoved)
        uppy.on('restriction-failed', fileErrorCallback)
        return () => {
            uppy.off('file-added', fileAdded)
            uppy.off('file-removed', fileRemoved)
            uppy.off('restriction-failed', fileErrorCallback)
        }
    }, [endpointUrl, setCustomFileMeta, setFileImportStep, setFileUuidAsync])

    const handleUpload = async () => {
        uppy.getFiles().forEach((file) => {
            uppy.setFileState(file.id, {
                progress: { uploadComplete: false, uploadStarted: false },
            })
        })
        try {
            await uppy.upload().then((result) => {
                if (result.successful.length > 0) {
                    setFileImportStep(fileImportStep === FileImportStepEnum.IMPORT ? FileImportStepEnum.VALIDATE : FileImportStepEnum.IMPORT)
                }

                const successfulFilesInfo = result.successful.map((item) => ({
                    id: item.id,
                    error: false,
                }))
                const failedFilesInfo = result.failed.map((item) => ({
                    id: item.id,
                    error: true,
                }))

                setUploadFileProgressInfo([...successfulFilesInfo, ...failedFilesInfo])
            })
        } catch (error) {
            setErrorMessages((prev) => [...prev, t('fileImport.uploadFailed')])
        }
    }
    const handleRemoveFile = (fileId: string) => {
        uppy.removeFile(fileId)
    }

    const cancelImport = () => {
        setErrorMessages([])
        setCurrentFiles([])
        setUploadFileProgressInfo([])
        uppy.resetProgress()
        uppy.setState({ files: {} })
    }

    return {
        currentFiles,
        handleUpload,
        handleRemoveFile,
        cancelImport,
        uppy,
        errorMessages,
        setErrorMessages,
        uploadFileProgressInfo,
        setUploadFileProgressInfo,
    }
}
