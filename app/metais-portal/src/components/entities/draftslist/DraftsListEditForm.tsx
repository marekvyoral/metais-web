import { useCallback, useEffect, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import {
    ApiLink,
    ApiStandardRequest,
    useCreateStandardRequestUpload,
    useUpdateStandardRequest,
} from '@isdd/metais-common/api/generated/standards-swagger'
import { Button } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { DMS_DOWNLOAD_BASE, FileImportStepEnum, QueryFeedback } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidV4 } from 'uuid'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { DraftsListAttachmentsZone } from '@/components/entities/draftslist/DraftsListAttachmentsZone'
import styles from '@/components/entities/draftslist/draftsListCreateForm.module.scss'
import { generateSchemaForEditDraft } from '@/components/entities/draftslist/schema/editDraftSchema'
import { FileUploadData, IFileUploadRef } from '@/components/FileUpload/FileUpload'

interface IDraftsListEditForm {
    defaultData?: ApiStandardRequest
}

export const fileToDataUri = (file: Blob) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            resolve(event.target?.result as string)
        }
        reader.readAsDataURL(file)
    })

export const DraftsListEditForm = ({ defaultData }: IDraftsListEditForm) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const { register, setValue, watch, handleSubmit, formState } = useForm({
        defaultValues: {
            ...defaultData,
        },
        resolver: yupResolver(generateSchemaForEditDraft(t)),
    })
    const { mutateAsync: updateDraft, isSuccess: isUpdateStandardRequestSuccess, isError, isLoading } = useUpdateStandardRequest()
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

    // const [dataFile, setDataFile] = useState<File>()
    // const {
    //     data: CreateStandardRequestUploadData,
    //     isLoading: CreateStandardRequestUploadLoading,
    //     isError: CreateStandardRequestUploadError,
    //     mutateAsync: createStandardRequestUploadMutateAsync,
    // } = useCreateStandardRequestUpload()

    // const handleCreateStandardRequestUpload = useCallback(
    //     (file: Blob | undefined, request: string) => {
    //         file &&
    //             createStandardRequestUploadMutateAsync({
    //                 data: { file },
    //                 params: {
    //                     request,
    //                 },
    //             })
    //     },
    //     [createStandardRequestUploadMutateAsync],
    // )

    const onSubmit = useCallback(
        async (values: FieldValues) => {
            await updateDraft({
                standardRequestId: defaultData?.id ?? 0,
                data: {
                    ...values,
                },
            })

            //handleCreateStandardRequestUpload(dataFile, JSON.stringify({ ...values }))
        },
        [defaultData?.id, updateDraft],
    )

    const errors = formState?.errors
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)
    const fileUploadRef = useRef<IFileUploadRef>(null)
    const formDataRef = useRef<FieldValues>([])
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

    const handleUploadSuccess = (uploadedFiles: FileUploadData[]) => {
        const attachments =
            uploadedFiles?.map((file) => ({
                attachmentId: file?.fileId,
                attachmentName: file?.fileName,
                attachmentSize: file?.fileSize,
                attachmentType: file?.fileType,
                attachmentDescription: '-',
            })) ?? []

        onSubmit({
            ...formDataRef.current,
            attachments: attachments,
        })
    }

    const handleSubmitForm = async (values: FieldValues) => {
        if (fileUploadRef.current?.hasFilesToUpload()) {
            formDataRef.current = values
            fileUploadRef.current?.startUploading()
            return
        }

        onSubmit({
            ...values,
            attachments: [],
        })
    }

    useEffect(() => {
        if (isUpdateStandardRequestSuccess) {
            setIsActionSuccess({
                value: true,
                path: NavigationSubRoutes.ZOZNAM_NAVRHOV,
                additionalInfo: { type: 'edit' },
            })
            navigate(`${NavigationSubRoutes.ZOZNAM_NAVRHOV}`, { state: { from: location } })
        }
    }, [navigate, setIsActionSuccess, isUpdateStandardRequestSuccess, location])

    return (
        <>
            <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent', transparentMask: false }} withChildren>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <DraftsListAttachmentsZone
                        links={links as ApiLink[]}
                        register={register}
                        addNewLink={addNewLink}
                        onDelete={removeLink}
                        errors={errors}
                        uppyHelpers={{ uppy, uploadFilesStatus, handleRemoveFile, currentFiles, generalErrorMessages, removeGeneralErrorMessages }}
                        fileUploadRef={fileUploadRef}
                        onFileUploadSuccess={handleUploadSuccess}
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
            </QueryFeedback>
        </>
    )
}
