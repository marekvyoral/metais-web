import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ErrorBlock, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Input } from '@isdd/idsk-ui-kit/src/input/Input'
import { RefAttributesRefType } from '@isdd/metais-common/api/generated/dms-swagger'
import { ApiLink, ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { getInfoGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { FileUpload, FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { API_STANDARD_REQUEST_ATTRIBUTES, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { DraftListCreateFormDialog } from '@/components/entities/draftslist/DraftListCreateFormDialog'
import { DraftsListAttachmentsZone } from '@/components/entities/draftslist/DraftsListAttachmentsZone'
import styles from '@/components/entities/draftslist/draftsListCreateForm.module.scss'
import { generateSchemaForCreateDraft } from '@/components/entities/draftslist/schema/createDraftSchema'

interface CreateForm {
    data: {
        guiAttributes: Attribute[]
        defaultData: ApiStandardRequest | undefined
    }
    id?: number
    onSubmit(data: FieldValues): Promise<void>
    isError: boolean
    isLoading: boolean
    fileUploadRef: React.RefObject<IFileUploadRef>
    handleUploadSuccess: (data: FileUploadData[]) => void
    sendData: (values: FieldValues, name?: string, email?: string, capthcaToken?: string) => Promise<void>
    handleUploadFailed?: () => void
}

export const DraftsListCreateForm = ({
    data,
    isError,
    isLoading,
    fileUploadRef,
    handleUploadSuccess,
    sendData,
    id,
    handleUploadFailed,
}: CreateForm) => {
    const { t } = useTranslation()
    const [openCreateFormDialog, setOpenCreateFormDialog] = useState<FieldValues>()
    const navigate = useNavigate()

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

    const handleSubmitForm = async (values: FieldValues) => {
        if (user) {
            sendData(values)
        } else {
            setOpenCreateFormDialog(values)
        }
    }

    const errors = formState?.errors

    return (
        <QueryFeedback loading={isLoading} withChildren>
            <DraftListCreateFormDialog
                openCreateFormDialog={openCreateFormDialog}
                closeCreateFormDialog={() => setOpenCreateFormDialog(undefined)}
                handleSubmit={sendData}
            />

            <FlexColumnReverseWrapper>
                <TextHeading size="L">{t('DraftsList.createForm.heading')}</TextHeading>
                <MutationFeedback error={isError} />
            </FlexColumnReverseWrapper>

            {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

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
                <DraftsListAttachmentsZone links={links} register={register} addNewLink={addNewLink} onDelete={removeLink} errors={errors} />
                <TextHeading size="M">{t('DraftsList.createForm.links.andOrAddFile')}</TextHeading>
                {user && (
                    <FileUpload
                        ref={fileUploadRef}
                        allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                        multiple
                        isUsingUuidInFilePath
                        refType={RefAttributesRefType.STANDARD_REQUEST}
                        onUploadSuccess={handleUploadSuccess}
                        refId={id?.toString()}
                        onFileUploadFailed={handleUploadFailed}
                    />
                )}
                <Spacer vertical />
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
