import React, { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { ApiLink, ApiStandardRequest, useUpdateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Button, LoadingIndicator } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { DMS_DOWNLOAD_FILE, FileImportStepEnum, MutationFeedback } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidV4 } from 'uuid'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'

import { DraftsListAttachmentsZone } from '@/components/entities/draftsList/DraftsListAttachmentsZone'
import styles from '@/components/entities/draftsList/draftsListCreateForm.module.scss'
import { generateSchemaForEditDraft } from '@/components/entities/draftsList/schema/editDraftSchema'

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
    const links = (watch('links') ?? []) as ApiLink[]

    const addNewLink = () => {
        const newLinks = [...(links ?? []), {} as ApiLink]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setValue('links', newLinks)
    }

    const removeLink = (removeIndex: number) => {
        const newAttachments = links?.filter((_: ApiLink, index: number) => index !== removeIndex)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
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

    const id = uuidV4() // TODO: vymazat ked bude BE opraveny
    const { uppy, currentFiles, handleRemoveFile, uploadFileProgressInfo, handleUpload } = useUppy({
        multiple: true,
        fileImportStep,
        endpointUrl: `${DMS_DOWNLOAD_FILE}/${id}`,
        setFileImportStep,
        setCustomFileMeta: () => ({ uuid: id }),
    })

    const handleSubmitForm = useCallback(
        async (values: FieldValues) => {
            await handleUpload()
            const uploadedFiles =
                currentFiles?.map((file) => ({
                    attachmentId: file?.meta?.uuid,
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
                    links={links}
                    register={register}
                    addNewLink={addNewLink}
                    onDelete={removeLink}
                    errors={errors}
                    uppyHelpers={{ uppy, uploadFileProgressInfo, handleRemoveFile, currentFiles }}
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
