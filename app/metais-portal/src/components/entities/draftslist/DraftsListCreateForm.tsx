import React, { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Input } from '@isdd/idsk-ui-kit/src/input/Input'
import { useTranslation } from 'react-i18next'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { Button, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { API_STANDARD_REQUEST_ATTRIBUTES, DMS_DOWNLOAD_BASE, FileImportStepEnum, MutationFeedback } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiLink, ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { getInfoGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { v4 as uuidV4 } from 'uuid'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import styles from '@/components/entities/draftslist/draftsListCreateForm.module.scss'
import { DraftListCreateFormDialog } from '@/components/entities/draftslist/DraftListCreateFormDialog'
import { generateSchemaForCreateDraft } from '@/components/entities/draftslist/schema/createDraftSchema'
import { DraftsListAttachmentsZone } from '@/components/entities/draftslist/DraftsListAttachmentsZone'

interface CreateForm {
    data: {
        guiAttributes: Attribute[]
        defaultData: ApiStandardRequest | undefined
    }
    onSubmit(data: FieldValues): Promise<void>
    isSuccess: boolean
    isError: boolean
    isLoading: boolean
}
export const DraftsListCreateForm = ({ onSubmit, data, isSuccess, isError, isLoading }: CreateForm) => {
    const { t } = useTranslation()
    const [openCreateFormDialog, setOpenCreateFormDialog] = useState<boolean>(false)
    const navigate = useNavigate()
    const {
        state: { user },
    } = useAuth()
    const { register, handleSubmit, setValue, watch, getValues, formState } = useForm({
        defaultValues: {
            ...data?.defaultData,
            version: 2,
            // eslint-disable-next-line no-warning-comments
            actionDesription: '-', // TODO: Vymazat ak sa fixne BE
            email: user ? '-' : undefined,
            name: user ? '-' : undefined,
            srDescription2: '-',
            srDescription3: '-',
            srDescription4: '-',
            srDescription5: '-',
            srDescription6: '-',
            proposalDescription1: '-',
            applicabilityDescription1: '-',
            applicabilityDescription2: '-',
            applicabilityDescription3: '-',
            applicabilityDescription4: '-',
            relevanceDescription1: '-',
            adaptabilityDescription1: '-',
            adaptabilityDescription2: '-',
            impactDescription2: '-',
            impactDescription3: '-',
            impactDescription4: '-',
            impactDescription6: '-',
            impactDescription8: '-',
            impactDescription9: '-',
            impactDescription10: '-',
            impactDescription11: '-',
            impactDescription12: '-',
            scalabilityDescription1: '-',
            expandabilityDescription1: '-',
            expandabilityDescription2: '-',
            stabilityDescription1: '-',
            stabilityDescription2: '-',
            stabilityDescription3: '-',
            maintenanceDescription1: '-',
            outputsDescription1: '-',
            outputsDescription2: '-',
            outputsDescription3: '-',
            outputsDescription4: '-',
            outputsDescription5: '-',
            processDescription1: '-',
            processDescription2: '-',
            processDescription3: '-',
            processDescription4: '-',
            processDescription5: '-',
            processDescription6: '-',
            extensionDescription1: '-',
            extensionDescription2: '-',
            extensionDescription3: '-',
            extensionDescription4: '-',
            extensionDescription5: '-',
            extensionDescription6: '-',
            extensionDescription7: '-',
            maturityDescription1: '-',
            maturityDescription2: '-',
            maturityDescription3: '-',
            reusabilityDescription1: '-',
            reusabilityDescription2: '-',
        },
        resolver: yupResolver(generateSchemaForCreateDraft(t)),
    })
    const links = watch('links') ?? []

    const addNewLink = () => {
        const newLinks = [
            ...(links ?? []),
            { name: undefined, id: undefined, type: undefined, linkType: undefined, linkSize: undefined, url: '', linkDescription: '' },
        ]
        setValue('links', newLinks)
    }

    const removeLink = (removeIndex: number) => {
        const newAttachments = links?.filter((_: ApiLink, index: number) => index !== removeIndex)
        setValue('links', newAttachments)
    }

    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)

    // eslint-disable-next-line no-warning-comments
    const { uppy, currentFiles, handleRemoveFile, uploadFileProgressInfo, handleUpload } = useUppy({
        multiple: true,
        fileImportStep,
        endpointUrl: `${DMS_DOWNLOAD_BASE}`,
        setFileImportStep,
        setCustomFileMeta: () => {
            const id = uuidV4()
            return { 'x-Content-Uuid': id }
        },
    })

    const handleSubmitForm = useCallback(
        async (values: FieldValues) => {
            if (currentFiles?.length > 0) await handleUpload()
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

    const errors = formState?.errors

    return (
        <div>
            <DraftListCreateFormDialog
                openCreateFormDialog={openCreateFormDialog}
                closeCreateFormDialog={() => setOpenCreateFormDialog(false)}
                handleSubmit={handleSubmit(handleSubmitForm)}
                register={register}
            />
            {isLoading && <LoadingIndicator fullscreen />}
            <MutationFeedback error={isError} success={isSuccess} />
            <TextHeading size="L">{t('DraftsList.createForm.heading')}</TextHeading>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
                <Input
                    {...register(API_STANDARD_REQUEST_ATTRIBUTES.srName)}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srName, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srName, data?.guiAttributes)}
                    error={formState?.errors?.srName?.message}
                    required
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.srDescription1}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.srDescription1}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srDescription1, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srDescription1, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.srDescription1)}
                    error={formState?.errors?.srDescription1?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2)}
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3)}
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1)}
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5)}
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7)}
                />
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
                        onClick={() => navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV)}
                    />
                    <Button
                        label={t('DraftsList.createForm.submit')}
                        type={user ? 'submit' : undefined}
                        onClick={() => !user && setOpenCreateFormDialog(true)}
                    />
                </div>
            </form>
        </div>
    )
}
