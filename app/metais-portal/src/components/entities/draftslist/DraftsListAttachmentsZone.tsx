import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiAttachment, ApiLink } from '@isdd/metais-common/api/generated/standards-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import stylesImport from '@isdd/metais-common/components/file-import/FileImport.module.scss'
import { StatusBar } from '@uppy/react'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'
import { UppyFile, Uppy } from '@uppy/core'
import { UploadingFilesStatus } from '@isdd/metais-common/hooks/useUppy'

import { DraftsListAttachmentCard } from '@/components/entities/draftslist/DraftsListAttachmentCard'

interface IDraftsListAttachmentsZone {
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
    uppyHelpers: {
        uppy: Uppy
        handleRemoveFile: (fileId: string) => void
        removeGeneralErrorMessages: () => void
        generalErrorMessages: string[]
        currentFiles: UppyFile[]
        uploadFilesStatus: UploadingFilesStatus
    }
}

export const DraftsListAttachmentsZone = ({ register, addNewLink, onDelete, links, errors, uppyHelpers }: IDraftsListAttachmentsZone) => {
    const { t } = useTranslation()
    const { uppy, handleRemoveFile, removeGeneralErrorMessages, generalErrorMessages, currentFiles, uploadFilesStatus } = uppyHelpers
    return (
        <div>
            <TextHeading size="L">{t('DraftsList.createForm.links.heading')}</TextHeading>

            <TextHeading size="M">{t('DraftsList.createForm.links.subHeading')}</TextHeading>
            {links?.map((_, index) => (
                <DraftsListAttachmentCard key={index} register={register} index={index} onDelete={onDelete} errors={errors} />
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
                        handleRemoveFile={handleRemoveFile}
                        removeGeneralErrorMessages={removeGeneralErrorMessages}
                        generalErrorMessages={generalErrorMessages}
                        fileList={currentFiles}
                        uploadFilesStatus={uploadFilesStatus}
                    />
                </div>
            </div>
        </div>
    )
}
