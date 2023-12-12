import { Button, CheckBox, IOption, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { GroupWithIdentities } from '@isdd/metais-common/api/generated/iam-swagger'
import classNames from 'classnames'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { User } from '@isdd/metais-common/contexts/auth/authContext'
import { SubmitWithFeedback, formatDateForDefaultValue } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { TFunction } from 'i18next'
import { ApiAttachment, ApiLink, ApiStandardRequestPreviewList, ApiVote, ApiVoteChoice } from '@isdd/metais-common/api/generated/standards-swagger'
import { DateTime } from 'luxon'

import {
    getPageTitle,
    getStandardRequestOptions,
    mapFormToApiRequestBody,
    mapProcessedExistingFilesToApiAttachment,
    mapUploadedFilesToApiAttachment,
} from './functions/voteEditFunc'
import { SelectVoteActors } from './components/SelectVoteActors'
import { ExistingFileData, ExistingFilesHandler, IExistingFilesHandlerRef } from './components/ExistingFilesHandler/ExistingFilesHandler'

import {
    StandardRequestsListModal,
    StandardRequestsListModalRefType,
} from '@/components/views/standardization/votes/components/StandardRequestsListModal/StandardRequestsListModal'
import { FileUpload, FileUploadData, IFileUploadRef } from '@/components/FileUpload/FileUpload'
import { LinksImport } from '@/components/LinksImport/LinksImport'
import styles from '@/components/views/standardization/votes/vote.module.scss'
import { Spacer } from '@/components/Spacer/Spacer'
import { AnswerDefinitions } from '@/components/views/standardization/votes/components/AnswerDefinitions/AnswerDefinitions'

export interface IVoteEditView {
    user: User | null
    existingVoteDataToEdit?: ApiVote
    allStandardRequestData?: ApiStandardRequestPreviewList
    groupWithIdentitiesData?: GroupWithIdentities[]
    isSubmitLoading?: boolean
    isSubmitError?: boolean
    isIdentifiersLoading: boolean
    createVote: (newVoteData: ApiVote) => void
    updateVote: (updatedVoteData: ApiVote) => void
    onCancel: () => void
}

export interface IVoteEditForm {
    voteSubject?: string
    voteDescription?: string
    standardRequest?: number
    documentLinks?: ApiLink[]
    invitedGroups?: string[]
    invitedUsers?: string[]
    answerDefinitions?: ApiVoteChoice[]
    secretVote?: boolean
    effectiveFrom?: Date
    effectiveTo?: Date
    vetoRight?: boolean
}

const schema = (t: TFunction<'translation', undefined, 'translation'>): Yup.ObjectSchema<IVoteEditForm> => {
    const today = new Date(new Date().setHours(0, 0, 0, 0))

    return Yup.object()
        .shape({
            voteSubject: Yup.string().required(t('validation.required')),
            voteDescription: Yup.string().required(t('validation.required')),
            standardRequest: Yup.number().required(t('validation.required')),
            documentLinks: Yup.array().of(
                Yup.object().shape({
                    id: Yup.number(),
                    url: Yup.string().required(t('validation.required')),
                    linkType: Yup.string(),
                    linkSize: Yup.string(),
                    linkDescription: Yup.string().required(t('validation.required')),
                }),
            ),
            answerDefinitions: Yup.array().of(
                Yup.object().shape({
                    id: Yup.number(),
                    value: Yup.string().required(t('validation.required')),
                }),
            ),
            invitedGroups: Yup.array(),
            invitedUsers: Yup.array().min(1, t('validation.required')),
            secretVote: Yup.boolean().required(t('validation.required')),
            effectiveFrom: Yup.date()
                .typeError(t('validation.required'))
                .required(t('validation.required'))
                .min(today, `${t('validation.dateMustBeEqualOrGreaterThen')} ${formatDateForDefaultValue(today.toString(), 'dd.MM.yyyy')}`),
            effectiveTo: Yup.date()
                .typeError(t('validation.required'))
                .required(t('validation.required'))
                .when('effectiveFrom', (effectiveFrom, yupSchema) => {
                    return DateTime.fromJSDate(new Date(`${effectiveFrom}`)).isValid
                        ? yupSchema.min(effectiveFrom, `${t('validation.dateMustBeGreaterThen')} ${t('votes.voteEdit.date.fromDate')}`)
                        : yupSchema
                }),
            vetoRight: Yup.boolean().required(t('validation.required')),
        })
        .defined()
}

const defaultAnswerDefinitionsValues = (t: TFunction<'translation', undefined, 'translation'>): ApiVoteChoice[] => [
    { value: t('votes.voteEdit.answers.yes') },
    { value: t('votes.voteEdit.answers.no') },
    { value: t('votes.voteEdit.answers.didNotVote') },
]

export const VoteComposeFormView: React.FC<IVoteEditView> = ({
    user,
    existingVoteDataToEdit,
    allStandardRequestData,
    groupWithIdentitiesData,
    isIdentifiersLoading,
    isSubmitLoading,
    createVote,
    updateVote,
    onCancel,
}) => {
    const isNewVote = !existingVoteDataToEdit
    const { t } = useTranslation()

    const standardRequestOptions: IOption<number | undefined>[] = useMemo(() => {
        return getStandardRequestOptions(allStandardRequestData)
    }, [allStandardRequestData])

    const [selectedRequestId, setSelectedRequestId] = useState<number | undefined>(existingVoteDataToEdit?.standardRequestId)

    const mapApiVoteToFormData = (apiVoteData: ApiVote | undefined): IVoteEditForm => {
        const returnFormData: IVoteEditForm = {
            voteSubject: apiVoteData?.name,
            voteDescription: apiVoteData?.description,
            standardRequest: apiVoteData?.standardRequestId,
            documentLinks: apiVoteData?.links,
            invitedUsers: [],
            answerDefinitions: apiVoteData?.voteChoices ?? defaultAnswerDefinitionsValues(t),
            secretVote: apiVoteData?.secret,
            vetoRight: apiVoteData?.veto,
            effectiveFrom: apiVoteData?.effectiveFrom ? (formatDateForDefaultValue(apiVoteData?.effectiveFrom) as unknown as Date) : undefined,
            effectiveTo: apiVoteData?.effectiveTo ? (formatDateForDefaultValue(apiVoteData?.effectiveTo) as unknown as Date) : undefined,
        }
        return returnFormData ?? {}
    }

    const { register, unregister, setValue, handleSubmit, formState, watch } = useForm<IVoteEditForm>({
        resolver: yupResolver(schema(t)),
        defaultValues: mapApiVoteToFormData(existingVoteDataToEdit),
    })

    const requestIdWatch = watch('standardRequest')
    useEffect(() => {
        if (requestIdWatch) {
            setSelectedRequestId(requestIdWatch)
        }
    }, [requestIdWatch])

    const fileUploadRef = useRef<IFileUploadRef>(null)
    const formDataRef = useRef<FieldValues>([])
    const attachmentsDataRef = useRef<ApiAttachment[]>([])
    const existingFilesProcessRef = useRef<IExistingFilesHandlerRef>(null)
    const openStandardRequestListModal = useRef<StandardRequestsListModalRefType>(null)

    const handleOpenStandardRequestListModal = () => {
        openStandardRequestListModal.current?.open()
    }

    const handleModalSelect = (rowId: number) => {
        setValue('standardRequest', rowId)
    }

    const callApi = (formData: FieldValues, attachments: ApiAttachment[]) => {
        const apiData: ApiVote = mapFormToApiRequestBody(formData, existingVoteDataToEdit?.id, user, attachments)
        if (isNewVote) {
            createVote(apiData)
        } else {
            updateVote(apiData)
        }
    }

    const handleDeleteFiles = () => {
        existingFilesProcessRef?.current?.startFilesProcessing()
    }

    const handleDeleteSuccess = () => {
        callApi(
            formDataRef.current,
            attachmentsDataRef.current.concat(
                mapProcessedExistingFilesToApiAttachment(existingFilesProcessRef.current?.getRemainingFileList() ?? []),
            ),
        )
    }

    const handleUploadSuccess = (data: FileUploadData[]) => {
        const attachmentsData = mapUploadedFilesToApiAttachment(data)
        if (existingFilesProcessRef.current?.hasDataToProcess()) {
            attachmentsDataRef.current = attachmentsData
            handleDeleteFiles()
        } else {
            callApi(formDataRef.current, attachmentsData)
        }
    }

    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const onSubmit = (formData: FieldValues) => {
        formDataRef.current = { ...formData }
        if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
            handleUploadData()
            return
        }
        if (existingFilesProcessRef.current?.hasDataToProcess()) {
            handleDeleteFiles()
            return
        }
        callApi(formData, [])
    }

    return (
        <>
            <StandardRequestsListModal
                allStandardRequestData={allStandardRequestData}
                ref={openStandardRequestListModal}
                handleSelect={handleModalSelect}
                selectedRequestId={selectedRequestId}
                setSelectedRequestId={setSelectedRequestId}
            />
            <TextHeading size="XL">{getPageTitle(isNewVote, t)}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)} className={classNames('govuk-!-font-size-19')}>
                <TextArea
                    rows={2}
                    id="voteSubject"
                    label={t('votes.voteEdit.subject')}
                    placeholder={t('votes.voteEdit.generalPlaceholder')}
                    {...register('voteSubject')}
                    error={formState.errors['voteSubject']?.message}
                />
                <div className={styles.inline}>
                    <SimpleSelect
                        label={`${t('votes.voteEdit.relatedDraft')} (${t('createEntity.required')})`}
                        options={standardRequestOptions}
                        setValue={setValue}
                        value={selectedRequestId}
                        name="standardRequest"
                        id="standardRequest"
                        className={classNames(styles.stretch)}
                        error={formState.errors['standardRequest']?.message}
                        isClearable={false}
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        label={t('votes.voteEdit.selectFromList')}
                        className={classNames(styles.marginLeft, styles.center)}
                        onClick={handleOpenStandardRequestListModal}
                    />
                </div>

                <TextArea
                    rows={2}
                    label={`${t('votes.voteEdit.description')} (${t('createEntity.required')})`}
                    id="voteDescription"
                    placeholder={t('votes.voteEdit.generalPlaceholder')}
                    {...register('voteDescription')}
                    error={formState.errors['voteDescription']?.message}
                />

                <Spacer vertical />
                <TextHeading size="XL">{t('votes.voteEdit.documents.title')}</TextHeading>
                <TextHeading size="L">{t('votes.voteEdit.documents.subtitle')}</TextHeading>

                <LinksImport defaultValues={existingVoteDataToEdit?.links} register={register} unregister={unregister} errors={formState.errors} />

                <FileUpload
                    ref={fileUploadRef}
                    allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                    multiple
                    isUsingUuidInFilePath
                    onUploadSuccess={handleUploadSuccess}
                />

                <ExistingFilesHandler
                    existingFiles={
                        existingVoteDataToEdit?.attachments?.map<ExistingFileData>((attachment) => {
                            return {
                                fileId: attachment.attachmentId,
                                fileName: attachment.attachmentName,
                                fileSize: attachment.attachmentSize,
                                fileType: attachment.attachmentType,
                            }
                        }) ?? []
                    }
                    ref={existingFilesProcessRef}
                    onFilesProcessingSuccess={handleDeleteSuccess}
                />

                <TextHeading size="XL">{t('votes.voteEdit.invited.title')}</TextHeading>

                <SelectVoteActors
                    setValue={setValue}
                    userList={groupWithIdentitiesData}
                    isLoading={isIdentifiersLoading}
                    defaultValues={existingVoteDataToEdit?.voteActors}
                    watch={watch}
                    errors={formState.errors}
                />

                <CheckBox label={t('votes.voteEdit.secretVote')} id="secretVote" {...register('secretVote')} />
                <Spacer vertical />

                <div className={classNames(styles.inline, styles.spaceBetween)}>
                    <Input
                        {...register('effectiveFrom')}
                        type="date"
                        label={t('votes.voteEdit.date.fromDate')}
                        className={styles.stretchGrow}
                        error={formState.errors['effectiveFrom']?.message}
                        required
                    />
                    <div className={styles.space} />
                    <Input
                        {...register('effectiveTo')}
                        type="date"
                        label={t('votes.voteEdit.date.toDate')}
                        className={styles.stretchGrow}
                        error={formState.errors['effectiveTo']?.message}
                        required
                    />
                </div>
                <Spacer vertical />
                <TextHeading size="L">{t('votes.voteEdit.answers.title')}</TextHeading>
                <AnswerDefinitions
                    register={register}
                    unregister={unregister}
                    initialValues={existingVoteDataToEdit?.voteChoices ?? defaultAnswerDefinitionsValues(t)}
                    errors={formState.errors}
                />
                <Spacer vertical />
                <CheckBox label={t('votes.voteEdit.answers.veto')} id="veto" {...register('vetoRight')} />
                <Spacer vertical />
                <SubmitWithFeedback
                    submitButtonLabel={isNewVote ? t('votes.voteEdit.callVote') : t('votes.voteEdit.updateVote')}
                    loading={!!isSubmitLoading}
                    additionalButtons={[<Button key={1} variant="secondary" label={t('votes.voteEdit.cancel')} onClick={onCancel} />]}
                />
            </form>
        </>
    )
}
