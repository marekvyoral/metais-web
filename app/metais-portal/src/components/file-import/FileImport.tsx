import React, { useEffect, useState } from 'react'
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
}

export const FileImport: React.FC<IFileImport> = ({ allowedFileTypes, isOpen, close, multiple, endpointUrl, maxFileSize = 20_971_520 }) => {
    const { i18n, t } = useTranslation()

    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [uploadFileProgressInfo, setUploadFileProgressInfo] = useState<ProgressInfoList[]>([])

    const [radioButtonMetaData, setRadioButtonMetaData] = useState<string>('existing-only')

    const [currentFiles, setCurrentFiles] = useState<UppyFile[]>([])

    useEffect(() => {
        //it works for some strings but f.e. some errors are still en when should be sk
        //did not find the cause, object names fits
        //if I set locale outside component on uppy = new Uppy it works
        //but that way it cant be dynamic
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
        uppy.getPlugin('XHRUpload')?.setOptions({ endpoint: endpointUrl })
    }, [endpointUrl])

    useEffect(() => {
        const fileErrorCallback = (_file: UppyFile | undefined, error: Error) => {
            setErrorMessages((prev) => [...prev, error.message])
        }
        const updateFiles = () => {
            setCurrentFiles(() => uppy.getFiles())
        }

        uppy.on('file-added', updateFiles)
        uppy.on('file-removed', updateFiles)
        uppy.on('restriction-failed', fileErrorCallback)
        return () => {
            uppy.off('file-added', updateFiles)
            uppy.off('file-removed', updateFiles)
            uppy.off('restriction-failed', fileErrorCallback)
        }
    }, [])

    const handleUpload = async () => {
        uppy.setMeta({ ['editType']: radioButtonMetaData })

        try {
            uppy.upload().then((result) => {
                if (result.successful.length > 0) {
                    setUploadFileProgressInfo(
                        result.successful.map((item) => ({
                            ['id']: item.id,
                            ['error']: false,
                        })),
                    )
                }

                if (result.failed.length > 0) {
                    setUploadFileProgressInfo(
                        result.failed.map((item) => ({
                            ['id']: item.id,
                            ['error']: true,
                        })),
                    )
                }
            })
        } catch (error) {
            setErrorMessages((prev) => [...prev, t('fileImport.uploadFailed')])
        }
    }

    const handleRemoveFile = (fileId: string) => {
        uppy.removeFile(fileId)
    }

    const handleCancelImport = () => {
        //close modal
        //uppy.reset() dont work/exist?
        setErrorMessages([])
        setCurrentFiles([])
        setUploadFileProgressInfo([])
        uppy.resetProgress()
        uppy.setState({ files: {} })
    }

    return (
        <BaseModal isOpen={isOpen} close={close}>
            <FileImportView
                uppy={uppy}
                currentFiles={currentFiles}
                handleUpload={handleUpload}
                uploadFileProgressInfo={uploadFileProgressInfo}
                handleCancelImport={handleCancelImport}
                handleRemoveFile={handleRemoveFile}
                setRadioButtonMetaData={setRadioButtonMetaData}
                setErrorMessages={setErrorMessages}
                errorMessages={errorMessages}
            />
        </BaseModal>
    )
}
