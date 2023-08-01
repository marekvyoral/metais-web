import React, { useCallback, useEffect, useState } from 'react'
import { UppyFile, Uppy } from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import '@uppy/core/dist/style.min.css'
import '@uppy/drag-drop/dist/style.min.css'
import '@uppy/status-bar/dist/style.min.css'
import { useTranslation } from 'react-i18next'
import sk_SK from '@uppy/locales/lib/sk_SK'
import en_US from '@uppy/locales/lib/en_US'
import { BaseModal } from '@isdd/idsk-ui-kit/index'

import { ProgressInfoList } from './FileImportList'
import { FileImportView } from './FileImportView'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { FileImportStepEnum } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { HierarchyRightsUi } from '@/api'

const uppy = new Uppy({
    autoProceed: false,
})

uppy.use(XHRUpload, {
    endpoint: '',
})

interface IFileImport {
    allowedFileTypes: string[]
    multiple: boolean
    endpointUrl: string
    //in bytes
    maxFileSize?: number
    isOpen: boolean
    close: () => void
    fileImportStep: FileImportStepEnum
    setFileImportStep: (value: FileImportStepEnum) => void
    ciType: string
}
export enum FileState {
    VALIDATED = 'validated',
    INVALIDATED = 'invalidated',
}

export const FileImport: React.FC<IFileImport> = ({
    allowedFileTypes,
    isOpen,
    close,
    multiple,
    endpointUrl,
    fileImportStep,
    setFileImportStep,
    maxFileSize = 20_971_520,
    ciType,
}) => {
    const {
        state: { accessToken },
    } = useAuth()
    const { i18n, t } = useTranslation()

    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [uploadFileProgressInfo, setUploadFileProgressInfo] = useState<ProgressInfoList[]>([])
    const [radioButtonMetaData, setRadioButtonMetaData] = useState<string>('existing-only')
    const [currentFiles, setCurrentFiles] = useState<UppyFile[]>([])

    const [selectedRoleId, setSelectedRoleId] = useState<string>('')
    const [selectedOrg, setSelectedOrg] = useState<HierarchyRightsUi | null>(null)

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
        uppy.getPlugin('XHRUpload')?.setOptions({ endpoint: endpointUrl, headers: { Authorization: `Bearer ${accessToken}` } })
    }, [accessToken, endpointUrl, fileImportStep])

    useEffect(() => {
        const fileErrorCallback = (_file: UppyFile | undefined, error: Error) => {
            setErrorMessages((prev) => [...prev, error.message])
        }
        const fileAdded = () => {
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
    }, [setFileImportStep])

    const handleValidate = useCallback(async () => {
        uppy.setMeta({ ['editType']: radioButtonMetaData, type: ciType, ['poId']: selectedOrg?.poUUID, ['roleId']: selectedRoleId })
        try {
            uppy.upload().then((result) => {
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

                const updatedFileIds = [...successfulFilesInfo.map((x) => x.id), ...failedFilesInfo.map((x) => x.id)]
                setUploadFileProgressInfo((prev) => {
                    const notUpdated = prev.filter((x) => !updatedFileIds.includes(x.id))
                    return [...notUpdated, ...successfulFilesInfo, ...failedFilesInfo]
                })
            })
        } catch (error) {
            setErrorMessages((prev) => [...prev, t('fileImport.uploadFailed')])
        }
    }, [ciType, fileImportStep, radioButtonMetaData, selectedOrg?.poUUID, selectedRoleId, setFileImportStep, t])

    const handleUpload = async () => {
        uppy.getFiles().forEach((file) => {
            uppy.setFileState(file.id, {
                progress: { uploadComplete: false, uploadStarted: false },
            })
        })
        try {
            uppy.upload().then((result) => {
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

    const handleCancelImport = () => {
        setErrorMessages([])
        setCurrentFiles([])
        setUploadFileProgressInfo([])
        uppy.resetProgress()
        uppy.setState({ files: {} })
        setRadioButtonMetaData('existing-only')
        close()
    }

    return (
        <BaseModal isOpen={isOpen} close={handleCancelImport}>
            <FileImportView
                uppy={uppy}
                currentFiles={currentFiles}
                handleUpload={fileImportStep === FileImportStepEnum.VALIDATE ? handleValidate : handleUpload}
                uploadFileProgressInfo={uploadFileProgressInfo}
                handleCancelImport={handleCancelImport}
                handleRemoveFile={handleRemoveFile}
                setRadioButtonMetaData={setRadioButtonMetaData}
                setErrorMessages={setErrorMessages}
                errorMessages={errorMessages}
                fileImportStep={fileImportStep}
                radioButtonMetaData={radioButtonMetaData}
                ciType={ciType}
                setSelectedRoleId={setSelectedRoleId}
                setSelectedOrg={setSelectedOrg}
                selectedOrg={selectedOrg}
            />
        </BaseModal>
    )
}
