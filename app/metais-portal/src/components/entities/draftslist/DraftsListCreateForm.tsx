import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ErrorBlock, TextHeading } from '@isdd/idsk-ui-kit/index'
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

    const sendData = async (values: FieldValues, name?: string, email?: string, capthcaToken?: string) => {
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
                    name,
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
                name,
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

            {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

            <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
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
                    error={formState?.errors?.proposalDescription2?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3)}
                    error={formState?.errors?.proposalDescription3?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1)}
                    error={formState?.errors?.impactDescription1?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5)}
                    error={formState?.errors?.impactDescription5?.message}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7)}
                    error={formState?.errors?.impactDescription7?.message}
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
