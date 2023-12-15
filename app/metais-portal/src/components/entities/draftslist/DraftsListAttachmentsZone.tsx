import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiAttachment, ApiLink } from '@isdd/metais-common/api/generated/standards-swagger'
import React, { RefObject, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import stylesImport from '@isdd/metais-common/components/file-import/FileImport.module.scss'
import { StatusBar } from '@uppy/react'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'
import { UppyFile, Uppy } from '@uppy/core'
import { UploadingFilesStatus } from '@isdd/metais-common/hooks/useUppy'

import { DraftsListAttachmentCard } from '@/components/entities/draftslist/DraftsListAttachmentCard'
import { FileUpload, FileUploadData, IFileUploadRef } from '@/components/FileUpload/FileUpload'

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
    fileUploadRef?: RefObject<IFileUploadRef>
    onFileUploadSuccess: (value: FileUploadData[]) => void
}

export const DraftsListAttachmentsZone = ({
    register,
    addNewLink,
    onDelete,
    links,
    errors,
    fileUploadRef,
    onFileUploadSuccess,
}: IDraftsListAttachmentsZone) => {
    const { t } = useTranslation()

    return (
        <div>
            <TextHeading size="L">{t('DraftsList.createForm.links.heading')}</TextHeading>
            <TextHeading size="M">{t('DraftsList.createForm.links.subHeading')}</TextHeading>
            {links?.map((_, index) => (
                <DraftsListAttachmentCard key={index} register={register} index={index} onDelete={onDelete} errors={errors} />
            ))}
            <Button label={t('DraftsList.createForm.links.addNewAttachment')} onClick={() => addNewLink()} />

            <FileUpload multiple isUsingUuidInFilePath ref={fileUploadRef} onUploadSuccess={onFileUploadSuccess} />
        </div>
    )
}
