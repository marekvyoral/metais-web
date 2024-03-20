import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { ApiLink, ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Button, ErrorBlock, LoadingIndicator } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { MutationFeedback } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { RefAttributesRefType } from '@isdd/metais-common/api/generated/dms-swagger'
import { FileUpload, FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'

import { DraftsListAttachmentsZone } from '@/components/entities/draftslist/DraftsListAttachmentsZone'
import styles from '@/components/entities/draftslist/draftsListCreateForm.module.scss'
import { generateSchemaForEditDraft } from '@/components/entities/draftslist/schema/editDraftSchema'

interface IDraftsListEditForm {
    defaultData?: ApiStandardRequest
    fileUploadRef: React.RefObject<IFileUploadRef>
    handleUploadSuccess: (data: FileUploadData[]) => void
    onSubmit: (values: FieldValues) => void
    isError: boolean
    isLoading: boolean
    onFileUploadFailed?: () => void
}

export const DraftsListEditForm = ({
    defaultData,
    fileUploadRef,
    handleUploadSuccess,
    onSubmit,
    isError,
    isLoading,
    onFileUploadFailed,
}: IDraftsListEditForm) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        state: { user },
    } = useAuth()

    const { register, setValue, watch, handleSubmit, formState } = useForm({
        defaultValues: {
            ...defaultData,
        },
        resolver: yupResolver(generateSchemaForEditDraft(t)),
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
        const newAttachments = links?.filter((_, index: number) => index !== removeIndex)
        setValue('links', newAttachments)
    }

    const errors = formState?.errors

    const callSubmit = (data: FieldValues) => {
        onSubmit(data)
    }

    const handleSubmitForm = () => {
        handleSubmit((data) => {
            callSubmit(data)
        })()
    }

    return (
        <>
            {isLoading && <LoadingIndicator fullscreen />}
            {isError && <MutationFeedback error={isError} success={false} />}

            {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

            <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
                <DraftsListAttachmentsZone
                    links={links as ApiLink[]}
                    register={register}
                    addNewLink={addNewLink}
                    onDelete={removeLink}
                    errors={errors}
                />
                {user && (
                    <FileUpload
                        ref={fileUploadRef}
                        allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                        multiple
                        isUsingUuidInFilePath
                        refType={RefAttributesRefType.STANDARD_REQUEST}
                        onUploadSuccess={handleUploadSuccess}
                        onFileUploadFailed={onFileUploadFailed}
                        refId={defaultData?.id?.toString()}
                    />
                )}
                <Spacer vertical />
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
