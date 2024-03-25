import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseModal } from '@isdd/idsk-ui-kit/index'

import { FileImportView } from './FileImportView'

import { FileImportStepEnum } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FileImportEditOptions } from '@isdd/metais-common/src/components/file-import/FileImportHeader'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'

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
    const { getRequestStatus } = useGetStatus()

    const {
        uppy,
        addGeneralErrorMessage,
        removeGeneralErrorMessages,
        currentFiles,
        handleRemoveFile,
        handleUpload,
        generalErrorMessages,
        cancelImport,
        uploadFilesStatus,
        updateUploadFilesStatus,
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
                result.successful.forEach(async (file) => {
                    await getRequestStatus(file.response?.body.requestId as string, () => updateUploadFilesStatus(file, true))
                })
                // result.successful.forEach((item) => updateUploadFilesStatus(item, true))
                result.failed.forEach((item) => updateUploadFilesStatus(item, false, item.error))
            })
        } catch (error) {
            addGeneralErrorMessage(t('fileImport.uploadFailed'))
        }
    }, [
        uppy,
        radioButtonMetaData,
        ciType,
        selectedOrg?.poUUID,
        selectedRole?.roleUuid,
        setFileImportStep,
        fileImportStep,
        getRequestStatus,
        updateUploadFilesStatus,
        addGeneralErrorMessage,
        t,
    ])

    const handleCancelImport = () => {
        cancelImport()
        setRadioButtonMetaData(FileImportEditOptions.EXISTING_ONLY)
        close()
    }

    const handleImport = () => {
        return fileImportStep === FileImportStepEnum.VALIDATE ? handleValidate : handleUpload
    }

    return (
        <BaseModal isOpen={isOpen} close={handleCancelImport}>
            <FileImportView
                uppy={uppy}
                currentFiles={currentFiles}
                handleImport={handleImport()}
                uploadFilesStatus={uploadFilesStatus}
                handleCancelImport={handleCancelImport}
                handleRemoveFile={handleRemoveFile}
                handleRemoveErrorMessage={removeGeneralErrorMessages}
                setRadioButtonMetaData={setRadioButtonMetaData}
                generalErrorMessages={generalErrorMessages}
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
