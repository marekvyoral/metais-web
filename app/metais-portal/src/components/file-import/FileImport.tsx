import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
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

import { FileImportStepEnum } from '@/components/actions-over-table/ActionsOverTable'
import { useAuth } from '@/contexts/auth/authContext'
import { useValidateContentHook } from '@/api/generated/impexp-cmdb-swagger'

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
    const importValidate = useValidateContentHook()
    const [radioButtonMetaData, setRadioButtonMetaData] = useState<string>('existing-only')
    const FILE_VALIDATION_BASE_URL = import.meta.env.VITE_REST_CLIENT_IMPEXP_CMDB_TARGET_URL

    const [currentFiles, setCurrentFiles] = useState<UppyFile[]>([])
    console.log('fileImportStep', fileImportStep)
    console.log('endpointUrl', endpointUrl)
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

    const [file, setFile] = useState<File>()

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const prepareUpload = () => {
        console.log('getFiles', uppy.getFiles()[0])
        const FILE_VALIDATION_BASE_URL = import.meta.env.VITE_REST_CLIENT_IMPEXP_CMDB_TARGET_URL
        const file = uppy.getFiles()[0]
        // const postData = new FormData()

        // postData.append('name', file.name)
        // postData.append('type', ciType)
        // postData.append('editType', 'existing-only')
        // postData.append('file', file.data)
        // console.log('file.data', file.data)
        // importValidate( validateContentBody: {params: { type: ciType }}, file: file.data )
        // importValidate(params: { type: ciType }, file: file.data )
        // console.log("uppy.getFiles()[0]", uppy.getFiles()[0])
        // importValidate({ file: file.data }, { type: ciType })
        //     .then(() => console.log('HURAA'))
        //     .catch((e) => console.log('chyba', e))
        fetch(`${FILE_VALIDATION_BASE_URL}/import/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization:
                    'Bearer eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ3ZWJQb3J0YWxDbGllbnQiLCJpc3MiOiJodHRwOlwvXC9pYW0tb2lkYy1tZXRhaXMzLmFwcHMuZGV2LmlzZGQuc2s6ODBcLyIsImV4cCI6MTY5MDIyODAzNywiaWF0IjoxNjkwMTk5MjM3LCJqdGkiOiIzNzEzNmVhNy1iNWEyLTRiMmQtYjcyNi03NGIxZTQxMTBmMjYifQ.UPDni9zUx5Ol0IqpFG5Num2qOhcN63Z7XcLBJlhUzbvMGFGVM1k7daNOkj0WuxBTLWEdOrGDo3_2wIvmybk_3sMV0b4iU7EvOczqMhoX3w1j68RwL7X2wZxlUfnH9Fz6gKtCG_8SpGxy9aRVx4UOb52-B01MwiZvJJUqhtfB-7016FzGLn-JJCCLzvDkFTPnNr_MFTsNOLgznfR8E8jeU4EtW7AHtWcNyIXeRuiIb0GaZVhll27vo_nGiRVDFa0moxAOJXq23eJ1eoP_tBGGqzeNVmxACjLM2NyGLTul7k72udan80OXvzLpmoUc9CcLUFc89Jo-hlIhnJZ5m-GsYQ',
            },
            body: postData,
        })
            .then((res) => {
                console.log('success', res)
                res.json()
                return true
            })
            .catch((e) => console.log('error', e))
        return Promise.resolve()
    }

    useEffect(() => {
        uppy.getPlugin('XHRUpload')?.setOptions({ endpoint: endpointUrl, headers: { Authorization: `Bearer ${accessToken}` } })
        uppy.addPreProcessor(prepareUpload)
    }, [accessToken, endpointUrl, fileImportStep])

    useEffect(() => {
        const fileErrorCallback = (_file: UppyFile | undefined, error: Error) => {
            setErrorMessages((prev) => [...prev, error.message])
        }
        const updateFiles = () => {
            setCurrentFiles(() => uppy.getFiles())
            const files = uppy.getFiles()
            if (!files.length) {
                setFileImportStep(FileImportStepEnum.VALIDATE)
            }
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

    const handleValidate = useCallback(async () => {
        uppy.setMeta({ ['editType']: radioButtonMetaData, type: ciType })
        console.log('fileImportStep', fileImportStep)
        try {
            uppy.upload().then((result) => {
                if (result.successful.length > 0) {
                    setFileImportStep(fileImportStep === FileImportStepEnum.IMPORT ? FileImportStepEnum.VALIDATE : FileImportStepEnum.IMPORT)
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
            console.log(error)
        }
    }, [ciType, fileImportStep, radioButtonMetaData, setFileImportStep, t])

    const handleUpload = async () => {
        // console.log('uppy.getFiles()', uppy.getFiles())
        uppy.getFiles().forEach((file) => {
            uppy.setFileState(file.id, {
                progress: { uploadComplete: false, uploadStarted: false },
            })
        })
        uppy.retryAll()
            .then((result) => {
                console.log("uppy.getPlugin('XHRUpload')", uppy.getPlugin('XHRUpload'))
                console.log('result', result)
            })
            .catch((error) => {
                console.log('error', error)
            })
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
        setRadioButtonMetaData('existing-only')
        close()
    }

    const handleUploadClick = () => {
        if (!file) {
            return
        }
        console.log('FILE', file)
        // 👇 Uploading the file using the fetch API to the server

        //OPTION 1 - NEJDE
        fetch(`${FILE_VALIDATION_BASE_URL}/import/validate?type='ISVS'`, {
            method: 'POST',
            body: file,
            // 👇 Set headers manually for single file upload
            headers: {
                'content-type': 'multipart/form-data',
                'content-length': `${file.size}`, // 👈 Headers need to be a string
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err))

        //OPTION 2 - NEJDE
        // importValidate({ file: file }, { type: 'ISVS' })
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />

            <div>{file && `${file.name} - ${file.type}`}</div>

            <button onClick={handleUploadClick}>Upload</button>
        </div>
    )
}
