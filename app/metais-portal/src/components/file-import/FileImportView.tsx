import React, { SetStateAction } from 'react'
import { Uppy, UppyFile } from '@uppy/core'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { StatusBar } from '@uppy/react'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { useTranslation } from 'react-i18next'

import { FileImportHeader } from './FileImportHeader'
import { FileImportItemsSelect } from './FileImportItemsSelect'
import { FileImportDragDrop } from './FileImportDragDrop'
import styles from './FileImport.module.scss'
import { FileImportList, ProgressInfoList } from './FileImportList'

import { FileImportStepEnum } from '@/components/actions-over-table/ActionsOverTable'
import { CloseIcon, ErrorTriangleIcon } from '@/assets/images'

interface IFileImportView {
    uppy: Uppy
    setRadioButtonMetaData: React.Dispatch<SetStateAction<string>>
    errorMessages: string[]
    setErrorMessages: React.Dispatch<SetStateAction<string[]>>
    handleRemoveFile: (fileId: string) => void
    handleCancelImport: () => void
    handleUpload: () => Promise<void>
    uploadFileProgressInfo: ProgressInfoList[]
    currentFiles: UppyFile[]
    fileImportStep: FileImportStepEnum
    radioButtonMetaData: string
}

export const FileImportView: React.FC<IFileImportView> = ({
    uppy,
    setRadioButtonMetaData,
    errorMessages,
    setErrorMessages,
    handleRemoveFile,
    handleCancelImport,
    handleUpload,
    uploadFileProgressInfo,
    currentFiles,
    fileImportStep,
    radioButtonMetaData,
}) => {
    const { t } = useTranslation()
    return (
        <>
            <FileImportHeader setRadioButtonMetaData={setRadioButtonMetaData} />
            {radioButtonMetaData === 'existing-and-new' && <FileImportItemsSelect />}
            <FileImportDragDrop uppy={uppy} />

            {errorMessages.length > 0 && (
                <div className={styles.errorWrapper}>
                    <img src={CloseIcon} onClick={() => setErrorMessages([])} />
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index} className={styles.errorMessages}>
                                <img src={ErrorTriangleIcon} />
                                <TextBody size="S" className={styles.textError}>
                                    {error}
                                </TextBody>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

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
                <FileImportList uppy={uppy} handleRemoveFile={handleRemoveFile} fileList={currentFiles} progressInfoList={uploadFileProgressInfo} />
            </div>
            <div className={styles.centeredButtons}>
                <Button onClick={handleCancelImport} label={t('fileImport.cancel')} variant="secondary" />
                <Button
                    onClick={handleUpload}
                    label={fileImportStep === FileImportStepEnum.VALIDATE ? t('fileImport.validate') : t('fileImport.import')}
                    disabled={currentFiles.length === 0}
                />
            </div>
        </>
    )
}