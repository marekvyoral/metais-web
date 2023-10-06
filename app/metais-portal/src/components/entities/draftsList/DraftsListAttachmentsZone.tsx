import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiAttachment, ApiLink } from '@isdd/metais-common/api/generated/standards-swagger'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { FileImportStepEnum } from '@isdd/metais-common/index'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import stylesImport from '@isdd/metais-common/components/file-import/FileImport.module.scss'
import { StatusBar } from '@uppy/react'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'

import { DraftsListAttachmentCard } from '@/components/entities/draftsList/DraftsListAttachmentCard'

interface IDraftsListAttachmentsZone {
    attachements: ApiAttachment[]
    links: ApiLink[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
    errors: FieldErrors<{
        attachments: ApiAttachment[] | undefined
        links:
            | {
                  name?: string | undefined
                  id?: number | undefined
                  type?: string | undefined
                  linkType?: string | undefined
                  linkSize?: string | undefined
                  url?: string | undefined
                  linkDescription?: string | undefined
              }[]
            | undefined
    }>
    addNewLink: () => void
    onDelete: (index: number) => void
}

export const DraftsListAttachmentsZone = ({ attachements, register, addNewLink, onDelete, links, errors }: IDraftsListAttachmentsZone) => {
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
            <TextHeading size="L">{t('DraftsList.createForm.links.heading')}</TextHeading>

            <TextHeading size="M">{t('DraftsList.createForm.links.subHeading')}</TextHeading>
            {links?.map((val, index) => (
                <DraftsListAttachmentCard
                    key={index}
                    register={register}
                    index={index}
                    onDelete={onDelete}
                    isPlaceholder={isPlaceholder}
                    errors={errors}
                />
            ))}

            <Button label={t('DraftsList.createForm.links.addNewAttachment')} onClick={() => addNewLink()} />

            <div>
                <TextHeading size="M">{t('DraftsList.createForm.links.andOrAddFile')}</TextHeading>
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
