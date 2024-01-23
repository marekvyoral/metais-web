import React, { SetStateAction } from 'react'
import { UploadResult, Uppy, UppyFile } from '@uppy/core'
import { StatusBar } from '@uppy/react'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { useTranslation } from 'react-i18next'
import { TextBody } from '@isdd/idsk-ui-kit'

import { FileImportEditOptions, FileImportHeader } from './FileImportHeader'
import { FileImportDragDrop } from './FileImportDragDrop'
import styles from './FileImport.module.scss'
import { FileImportList } from './FileImportList'

import { FileImportStepEnum } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { UploadingFilesStatus } from '@isdd/metais-common/hooks/useUppy'

interface IFileImportView {
    uppy: Uppy
    setRadioButtonMetaData: React.Dispatch<SetStateAction<FileImportEditOptions>>
    generalErrorMessages: string[]
    handleRemoveFile: (fileId: string) => void
    handleRemoveErrorMessage: () => void
    handleCancelImport: () => void
    handleImport: () => Promise<UploadResult | undefined> | Promise<void>
    uploadFilesStatus: UploadingFilesStatus
    currentFiles: UppyFile[]
    fileImportStep: FileImportStepEnum
    radioButtonMetaData: string
    ciType: string
    setSelectedRole: React.Dispatch<SetStateAction<GidRoleData | null>>
    setSelectedOrg: React.Dispatch<SetStateAction<HierarchyRightsUi | null>>
    selectedOrg: HierarchyRightsUi | null
    selectedRole: GidRoleData
}

export const FileImportView: React.FC<IFileImportView> = ({
    uppy,
    setRadioButtonMetaData,
    generalErrorMessages,
    handleRemoveFile,
    handleRemoveErrorMessage,
    handleCancelImport,
    handleImport,
    uploadFilesStatus,
    currentFiles,
    fileImportStep,
    radioButtonMetaData,
    setSelectedRole,
    setSelectedOrg,
    selectedOrg,
    selectedRole,
    ciType,
}) => {
    const { t } = useTranslation()
    const isSubmitDisabled = currentFiles.length === 0 || (radioButtonMetaData === FileImportEditOptions.EXISTING_AND_NEW && !selectedRole.roleUuid)

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(ciType)

    return (
        <>
            <FileImportHeader setRadioButtonMetaData={setRadioButtonMetaData} />
            {radioButtonMetaData === FileImportEditOptions.EXISTING_AND_NEW && (
                <QueryFeedback loading={isCiTypeDataLoading} error={isCiTypeDataError}>
                    <SelectPublicAuthorityAndRole
                        onChangeAuthority={setSelectedOrg}
                        onChangeRole={setSelectedRole}
                        selectedOrg={selectedOrg}
                        selectedRole={selectedRole}
                        ciRoles={ciTypeData?.roleList ?? []}
                    />
                </QueryFeedback>
            )}
            <FileImportDragDrop uppy={uppy} hideNoSelectedFileToImport={currentFiles.length > 0} />

            <div>
                {fileImportStep === FileImportStepEnum.DONE && (
                    <div className={styles.centeredButtons}>
                        <TextBody size="L" className={styles.greenBoldText}>
                            {t('fileImport.done')}
                        </TextBody>
                    </div>
                )}
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
                    removeGeneralErrorMessages={handleRemoveErrorMessage}
                    fileList={currentFiles}
                    uploadFilesStatus={uploadFilesStatus}
                    generalErrorMessages={generalErrorMessages}
                />
            </div>
            <div className={styles.centeredButtons}>
                <Button onClick={handleCancelImport} label={t('fileImport.cancel')} variant="secondary" />
                {fileImportStep !== FileImportStepEnum.DONE && (
                    <Button
                        onClick={handleImport}
                        label={fileImportStep === FileImportStepEnum.VALIDATE ? t('fileImport.validate') : t('fileImport.import')}
                        disabled={isSubmitDisabled}
                    />
                )}
            </div>
        </>
    )
}
