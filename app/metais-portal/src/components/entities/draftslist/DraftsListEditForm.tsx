import React, { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { ApiLink, ApiStandardRequest, useUpdateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Button, LoadingIndicator } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { DMS_DOWNLOAD_BASE, FileImportStepEnum, MutationFeedback } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidV4 } from 'uuid'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'

import { DraftsListAttachmentsZone } from '@/components/entities/draftslist/DraftsListAttachmentsZone'
import styles from '@/components/entities/draftslist/draftsListCreateForm.module.scss'
import { generateSchemaForEditDraft } from '@/components/entities/draftslist/schema/editDraftSchema'

interface IDraftsListEditForm {
    defaultData?: ApiStandardRequest
}

export const DraftsListEditForm = ({ defaultData }: IDraftsListEditForm) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { register, setValue, watch, handleSubmit, formState } = useForm({
        defaultValues: {
            ...defaultData,
        },
        resolver: yupResolver(generateSchemaForEditDraft(t)),
    })
    const { mutateAsync: updateDraft, isSuccess, isError, isLoading } = useUpdateStandardRequest()
    const links = watch('links') ?? []

    const addNewLink = () => {
        const newLinks = [
            ...(links ?? []),
            { name: undefined, id: undefined, type: undefined, linkType: undefined, linkSize: undefined, url: '', linkDescription: '' },
        ]
        setValue('links', newLinks)
    }

    const removeLink = (removeIndex: number) => {
        const newAttachments = links?.filter((_, index: number) => index !== removeIndex)
        setValue('links', newAttachments)
    }

    const onSubmit = useCallback(
        async (values: FieldValues) => {
            await updateDraft({
                standardRequestId: defaultData?.id ?? 0,
                data: {
                    ...values,
                },
            })
        },
        [defaultData, updateDraft],
    )

    const errors = formState?.errors
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)

    // eslint-disable-next-line no-warning-comments
    const { uppy, currentFiles, handleRemoveFile, uploadFilesStatus, handleUpload, generalErrorMessages, removeGeneralErrorMessages } = useUppy({
        multiple: true,
        fileImportStep,
        endpointUrl: `${DMS_DOWNLOAD_BASE}`,
        setFileImportStep,
        setCustomFileMeta: () => {
            const id = uuidV4()
            return { 'x-content-uuid': id }
        },
    })

    const handleSubmitForm = useCallback(
        async (values: FieldValues) => {
            if (currentFiles?.length > 0) await handleUpload()
            const uploadedFiles =
                currentFiles?.map((file) => ({
                    attachmentId: file?.meta['x-content-uuid'],
                    attachmentName: file?.name,
                    attachmentSize: file?.size,
                    attachmentType: file?.extension,
                    attachmentDescription: '-',
                })) ?? []
            onSubmit({
                ...values,
                attachments: uploadedFiles,
            })
        },
        [handleUpload, onSubmit, currentFiles],
    )

    return (
        <>
            {isLoading && <LoadingIndicator fullscreen />}
            <MutationFeedback error={isError} success={isSuccess} />

            <form onSubmit={handleSubmit(handleSubmitForm)}>
                <DraftsListAttachmentsZone
                    links={links as ApiLink[]}
                    register={register}
                    addNewLink={addNewLink}
                    onDelete={removeLink}
                    errors={errors}
                    uppyHelpers={{ uppy, uploadFilesStatus, handleRemoveFile, currentFiles, generalErrorMessages, removeGeneralErrorMessages }}
                />
                <div className={styles.buttonGroup}>
                    <Button
                        label={t('DraftsList.createForm.cancel')}
                        variant="secondary"
                        onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_NAVRHOV}/${defaultData?.id}`)}
                    />
                    <Button label={t('button.saveChanges')} type="submit" />
                </div>
            </form>
        </>
    )
}
