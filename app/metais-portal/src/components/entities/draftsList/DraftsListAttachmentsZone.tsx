import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiAttachment } from '@isdd/metais-common/api/generated/standards-swagger'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UseFormRegister } from 'react-hook-form'
import { FileImportStepEnum } from '@isdd/metais-common/index'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import stylesImport from '@isdd/metais-common/components/file-import/FileImport.module.scss'
import { StatusBar } from '@uppy/react'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'

import { DraftsListAttachmentCard } from './DraftsListAttachmentCard'

interface IDraftsListAttachmentsZone {
    attachements: ApiAttachment[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
    addNewAttachement: () => void
    onDelete: (index: number) => void
}

export const DraftsListAttachmentsZone = ({ attachements, register, addNewAttachement, onDelete }: IDraftsListAttachmentsZone) => {
    const { t } = useTranslation()
    const isPlaceholder = attachements?.length === 1
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)

    const { uppy, currentFiles, handleRemoveFile, uploadFileProgressInfo } = useUppy({
        multiple: true,
        fileImportStep,
        setFileImportStep,
    })
    return (
        <div>
            <TextHeading size="L">{t('DraftsList.createForm.attachments.heading')}</TextHeading>

            <TextHeading size="M">{t('DraftsList.createForm.attachments.subHeading')}</TextHeading>
            {attachements?.length === 0 && <DraftsListAttachmentCard register={register} index={attachements?.length} onDelete={onDelete} />}
            {attachements?.map((val, index) => (
                <DraftsListAttachmentCard key={val?.id} register={register} index={index} onDelete={onDelete} isPlaceholder={isPlaceholder} />
            ))}

            <Button label={t('DraftsList.createForm.attachments.addNewAttachment')} onClick={() => addNewAttachement()} />

            <div>
                <TextHeading size="M">{t('DraftsList.createForm.attachments.andOrAddFile')}</TextHeading>
                <FileImportDragDrop uppy={uppy} />
                <div>
                    <StatusBar
                        className={stylesImport.statusBar}
                        uppy={uppy}
                        hideAfterFinish={false}
                        hideCancelButton
                        hidePauseResumeButton
                        hideRetryButton
                        hideUploadButton
                    />
                    <FileImportList
                        uppy={uppy}
                        handleRemoveFile={handleRemoveFile}
                        fileList={currentFiles}
                        progressInfoList={uploadFileProgressInfo}
                    />
                </div>
            </div>
        </div>
    )
}
