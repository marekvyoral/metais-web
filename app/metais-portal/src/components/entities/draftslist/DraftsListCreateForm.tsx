import { yupResolver } from '@hookform/resolvers/yup'
import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Input } from '@isdd/idsk-ui-kit/src/input/Input'
import { ApiLink, ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { getInfoGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { API_STANDARD_REQUEST_ATTRIBUTES, DMS_DOWNLOAD_BASE, FileImportStepEnum, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { DraftListCreateFormDialog } from '@/components/entities/draftslist/DraftListCreateFormDialog'
import { DraftsListAttachmentsZone } from '@/components/entities/draftslist/DraftsListAttachmentsZone'
import styles from '@/components/entities/draftslist/draftsListCreateForm.module.scss'
import { generateSchemaForCreateDraft } from '@/components/entities/draftslist/schema/createDraftSchema'

interface CreateForm {
    data: {
        guiAttributes: Attribute[]
        defaultData: ApiStandardRequest | undefined
    }
    onSubmit(data: FieldValues): Promise<void>
    isError: boolean
    isLoading: boolean
}
const baseURL = import.meta.env.VITE_REST_CLIENT_STANDARDS_TARGET_URL

export const DraftsListCreateForm = ({ onSubmit, data, isError, isLoading }: CreateForm) => {
    const { t } = useTranslation()
    const [openCreateFormDialog, setOpenCreateFormDialog] = useState<FieldValues>()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const [customLoading, setCustomLoading] = useState(false)
    const [customError, setCustomError] = useState(false)

    const {
        state: { user },
    } = useAuth()
    const { register, handleSubmit, setValue, watch, getValues, formState } = useForm({
        defaultValues: {
            ...data?.defaultData,
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
    const { uppy, currentFiles, handleRemoveFile, uploadFilesStatus, handleUpload, removeGeneralErrorMessages, generalErrorMessages } = useUppy({
        multiple: true,
        fileImportStep,
        endpointUrl: `${DMS_DOWNLOAD_BASE}`,
        setFileImportStep,
        setCustomFileMeta: () => {
            const id = uuidV4()
            return {
                'x-content-uuid': id,
                refAttributes: new Blob(
                    [
                        JSON.stringify({
                            refType: 'STANDARD',
                        }),
                    ],
                    { type: 'application/json' },
                ),
            }
        },
    })

    const sendData = async (values: FieldValues, fullName?: string, email?: string, capthcaToken?: string) => {
        if (currentFiles?.length > 0) {
            setCustomLoading(true)
            await handleUpload()
        }
        const uploadedFiles =
            currentFiles?.map((file) => ({
                attachmentId: file?.meta['x-content-uuid'],
                attachmentName: file?.name,
                attachmentSize: file?.size,
                attachmentType: file?.extension,
                attachmentDescription: '-',
            })) ?? []

        if (capthcaToken) {
            setCustomLoading(true)
            const response = await fetch(`${baseURL}/standards/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'recaptcha-response': capthcaToken },
                body: JSON.stringify({
                    ...values,
                    fullName,
                    email,
                    attachments: uploadedFiles,
                }),
            })
            if (response.ok) {
                setIsActionSuccess({ value: true, path: NavigationSubRoutes.ZOZNAM_NAVRHOV, additionalInfo: { type: 'create' } })
                navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV)
            } else {
                setCustomError(true)
            }
            setCustomLoading(false)
        } else {
            onSubmit({
                ...values,
                fullName,
                email,
                attachments: uploadedFiles,
            })
        }
    }

    const handleSubmitForm = async (values: FieldValues) => {
        if (user) {
            sendData(values)
        } else {
            setOpenCreateFormDialog(values)
        }
    }

    const errors = formState?.errors

    return (
        <QueryFeedback loading={isLoading || customLoading} withChildren>
            <DraftListCreateFormDialog
                openCreateFormDialog={openCreateFormDialog}
                closeCreateFormDialog={() => setOpenCreateFormDialog(undefined)}
                handleSubmit={sendData}
            />

            <FlexColumnReverseWrapper>
                <TextHeading size="L">{t('DraftsList.createForm.heading')}</TextHeading>
                {(isError || customError) && <MutationFeedback error={t('feedback.mutationErrorMessage')} showSupportEmail success={false} />}
            </FlexColumnReverseWrapper>

            <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
                <Input
                    {...register(API_STANDARD_REQUEST_ATTRIBUTES.name)}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.name, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.name, data?.guiAttributes)}
                    error={formState?.errors?.name?.message}
                    required
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.description}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.description}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.description, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.description, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.description)}
                    error={formState?.errors?.description?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.placementProposal}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.placementProposal}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.placementProposal, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.placementProposal, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.placementProposal)}
                    error={formState?.errors?.placementProposal?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.legislativeTextProposal}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.legislativeTextProposal}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.legislativeTextProposal, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.legislativeTextProposal, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.legislativeTextProposal)}
                    error={formState?.errors?.legislativeTextProposal?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.financialImpact}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.financialImpact}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.financialImpact, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.financialImpact, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.financialImpact)}
                    error={formState?.errors?.financialImpact?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.securityImpact}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.securityImpact}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.securityImpact, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.securityImpact, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.securityImpact)}
                    error={formState?.errors?.securityImpact?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.privacyImpact}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.privacyImpact}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.privacyImpact, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.privacyImpact, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.privacyImpact)}
                    error={formState?.errors?.privacyImpact?.message}
                    isRequired
                />
                <DraftsListAttachmentsZone
                    links={links}
                    register={register}
                    addNewLink={addNewLink}
                    onDelete={removeLink}
                    errors={errors}
                    uppyHelpers={{ uppy, uploadFilesStatus, handleRemoveFile, removeGeneralErrorMessages, generalErrorMessages, currentFiles }}
                />
                <div className={styles.buttonGroup}>
                    <Button
                        label={t('DraftsList.createForm.cancel')}
                        variant="secondary"
                        onClick={() => navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV)}
                    />
                    <Button label={t('DraftsList.createForm.submit')} type={'submit'} />
                </div>
            </form>
        </QueryFeedback>
    )
}
