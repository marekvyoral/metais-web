import { UploadResult, Uppy, UppyFile } from '@uppy/core'
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
import { cleanFileName } from '@isdd/metais-common/utils/utils'
import {
    CiRefAttributes,
    DocumentTemplateRefAttributes,
    MeetingRequestRefAttributes,
    RefAttributesRefType,
    StandardRequestRefAttributes,
    UnknownRefAttributes,
    VoteRefAttributes,
} from '@isdd/metais-common/api/generated/dms-swagger'

interface iUseUppy {
    allowedFileTypes?: string[] // if undefined all file types are allowed
    maxFileSize?: number
    multiple: boolean
    endpointUrl?: string
    fileImportStep: FileImportStepEnum
    setFileImportStep: (value: FileImportStepEnum) => void
    setCustomFileMeta?: (file?: UppyFile<Record<string, unknown>, Record<string, unknown>>) => { [metaKey: string]: unknown }
    setFileUuidAsync?: (file?: UppyFile<Record<string, unknown>, Record<string, unknown>>) => Promise<{ uuid: string }>
    fileUploadError?: (responseError: { responseText: string; response: unknown }) => string
    refId?: string
    refType?: RefAttributesRefType
    method?: string
    fieldName?: string
}

export type UploadFileResponse = {
    body: Record<string, unknown>
    status: number
    uploadURL: string | undefined
}

export type UploadingFileState = {
    fileId: string
    fileName?: string
    uploadError?: string
    validationError?: string
    isUploaded: boolean
    response?: UploadFileResponse
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
    fileUploadError,
    refId,
    refType,
    method,
    fieldName,
}: iUseUppy) => {
    const { i18n, t } = useTranslation()
    const uppy = useMemo(() => {
        const uppyInstance = new Uppy({
            onBeforeFileAdded: (file) => {
                const name = cleanFileName(file.name)
                Object.defineProperty(file.data, 'name', {
                    writable: true,
                    value: name,
                })
                return { ...file, name, meta: { ...file.meta, name } }
            },
            autoProceed: false,
            locale: i18n.language === 'sk' ? sk_SK : en_US,
        })
        uppyInstance.use(XHRUpload, {
            endpoint: '',
            locale: i18n.language === 'sk' ? sk_SK : en_US,
            getResponseError(responseText, response) {
                return new Error(
                    fileUploadError
                        ? fileUploadError({
                              responseText,
                              response,
                          })
                        : t('fileImport.uploadFailed'),
                )
            },
        })
        return uppyInstance
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const getRefObject = useCallback(
        (
            type: RefAttributesRefType | undefined,
        ):
            | MeetingRequestRefAttributes
            | CiRefAttributes
            | VoteRefAttributes
            | DocumentTemplateRefAttributes
            | StandardRequestRefAttributes
            | UnknownRefAttributes => {
            switch (type) {
                case RefAttributesRefType.MEETING_REQUEST: {
                    const refObject: MeetingRequestRefAttributes = {
                        refType: type,
                        refMeetingRequestId: Number(refId),
                    }
                    return refObject
                }
                case RefAttributesRefType.CI: {
                    const refObject: CiRefAttributes = {
                        refType: type,
                        refCiId: refId,
                    }
                    return refObject
                }
                case RefAttributesRefType.VOTE: {
                    const refObject: VoteRefAttributes = {
                        refType: type,
                        refVoteId: Number(refId),
                    }
                    return refObject
                }
                case RefAttributesRefType.DOCUMENT_TEMPLATE: {
                    const refObject: DocumentTemplateRefAttributes = {
                        refType: type,
                        refDocumentTemplateId: Number(refId),
                    }
                    return refObject
                }
                case RefAttributesRefType.STANDARD_REQUEST: {
                    const refObject: StandardRequestRefAttributes = {
                        refType: type,
                        refStandardRequestId: Number(refId),
                    }
                    return refObject
                }
                default: {
                    const refObject: UnknownRefAttributes = {
                        refType: type,
                    }
                    return refObject
                }
            }
        },
        [refId],
    )

    useEffect(() => {
        const getBlob = async () => {
            const prevRefAttrs = await new Response(uppy.getState().meta['refAttributes']).text()
            if (prevRefAttrs && prevRefAttrs.length > 0) {
                uppy.setMeta({
                    refAttributes: new Blob(
                        [
                            JSON.stringify({
                                ...JSON.parse(prevRefAttrs),
                                ...getRefObject(refType),
                            }),
                        ],
                        { type: 'application/json' },
                    ),
                })
            } else {
                uppy.setMeta({
                    refAttributes: new Blob([JSON.stringify(getRefObject(refType))], { type: 'application/json' }),
                })
            }
        }
        getBlob()
    }, [getRefObject, refId, refType, uppy])

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
        (file: UppyFile | undefined, isUploadedSuccessfully = false, errorString?: string, response?: UploadFileResponse) => {
            if (!file?.id || !containsFileId(file.id)) {
                errorString && setGeneralErrorMessages((prev) => [...prev, errorString])
                return
            }
            setUploadFilesStatus((current) => [
                ...current.filter((c) => c.fileId !== file?.id),
                {
                    fileId: file?.id ?? '',
                    fileName: file?.name,
                    uploadError: errorString && t('fileImport.uploadFailed'),
                    isUploaded: isUploadedSuccessfully,
                    response,
                },
            ])
            return
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            ...(method ? { method: method } : {}),
            ...(fieldName ? { fieldName: fieldName } : {}),
            headers: { Authorization: `Bearer ${token}`, 'Accept-Language': i18n.language },
        })
    }, [token, endpointUrl, i18n.language, uppy, method, fieldName])

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
    }, [endpointUrl, setCustomFileMeta, setFileImportStep, setFileUuidAsync, t, updateUploadFilesStatus, uppy])

    const handleUpload = async (): Promise<UploadResult | undefined> => {
        resetProgressState()
        uppy.getFiles().forEach((file) => {
            uppy.setFileState(file.id, {
                progress: { uploadComplete: false, uploadStarted: false },
            })
        })
        try {
            const result = await uppy.upload()
            if (result.successful.length > 0) {
                changeFileImportStep()
            }
            result.successful.forEach((item) => updateUploadFilesStatus(item, true, undefined, item.response))
            result.failed.forEach((item) => updateUploadFilesStatus(item, false, item.error, item.response))
            return result
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
