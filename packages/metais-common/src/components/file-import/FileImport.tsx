import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseModal } from '@isdd/idsk-ui-kit/index'

import { FileImportView } from './FileImportView'

import { FileImportStepEnum } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FileImportEditOptions } from '@isdd/metais-common/src/components/file-import/FileImportHeader'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'

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
    const { t } = useTranslation()

    const [radioButtonMetaData, setRadioButtonMetaData] = useState<FileImportEditOptions>(FileImportEditOptions.EXISTING_ONLY)

    const [selectedRole, setSelectedRole] = useState<GidRoleData | null>(null)
    const [selectedOrg, setSelectedOrg] = useState<HierarchyRightsUi | null>(null)
    const {
        uppy,
        setUploadFileProgressInfo,
        setErrorMessages,
        currentFiles,
        uploadFileProgressInfo,
        handleRemoveFile,
        handleUpload,
        errorMessages,
        cancelImport,
    } = useUppy({
        maxFileSize,
        allowedFileTypes,
        multiple,
        endpointUrl,
        setFileImportStep,
        fileImportStep,
    })

    const handleValidate = useCallback(async () => {
        uppy.setMeta({ editType: radioButtonMetaData, type: ciType, poId: selectedOrg?.poUUID, roleId: selectedRole?.roleUuid })
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
    }, [
        ciType,
        fileImportStep,
        radioButtonMetaData,
        selectedOrg?.poUUID,
        selectedRole?.roleUuid,
        setErrorMessages,
        setFileImportStep,
        setUploadFileProgressInfo,
        t,
        uppy,
    ])

    const handleCancelImport = () => {
        cancelImport()
        setRadioButtonMetaData(FileImportEditOptions.EXISTING_ONLY)
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
                setSelectedRole={setSelectedRole}
                setSelectedOrg={setSelectedOrg}
                selectedOrg={selectedOrg}
                selectedRole={selectedRole ?? {}}
            />
        </BaseModal>
    )
}
